import ffmpeg from 'fluent-ffmpeg';
import { writeFile } from 'fs/promises';

const resolutions = [
  // {
  //   resolution: '1080p',
  //   size: '1920x1080',
  //   bitrate: '4500k',
  //   bandwidth: 5090000,
  // },
  // {
  //   resolution: '720p',
  //   size: '1280x720',
  //   bitrate: '3000k',
  //   bandwidth: 3440000,
  // },
  {
    resolution: '480p',
    size: '854x480',
    bitrate: '1500k',
    bandwidth: 1790000,
  },
  {
    resolution: '360p',
    size: '640x360',
    bitrate: '800k',
    bandwidth: 1020000,
  },
];

const thumbnailsCount = 4;

type TConfig = {
  onProgress: (percent: number) => void;
  outputFolder: string;
  filename: string;
};

async function transcodeForStreaming(
  inputPath: string,
  { outputFolder, onProgress, filename }: TConfig
) {
  const percents = Array(resolutions.length).fill(0);
  const transcodedFiles = Promise.all(
    resolutions.map((resolution, index) => {
      return new Promise<string>((resolve, reject) => {
        const output = `${outputFolder}${filename}_${resolution.resolution}.m3u8`;

        ffmpeg(inputPath)
          .outputOptions([
            `-vf scale=${resolution.size}`, // Scale video to resolution
            `-c:v libx264`, // H.264 video codec
            `-b:v ${resolution.bitrate}`, // Bitrate
            `-c:a aac`, // AAC audio codec
            `-strict -2`, // Allow non-strict standards for AAC
            `-hls_time 10`, // Split into 10-second segments for HLS
            `-hls_playlist_type vod`, // VOD playlist type
            `-hls_segment_filename ${outputFolder}${filename}_${resolution.resolution}_segment_%03d.ts`, // Segment filename pattern
          ])
          .output(output)
          .on('end', () => {
            console.log(`Transcoding completed for ${resolution.resolution}`);
            resolve(output);
          })
          .on('error', (err: Error) => {
            console.error(
              `Error transcoding for ${resolution.resolution}: ${err.message}`
            );
            reject(err);
          })
          .on('progress', (progress) => {
            if (!progress.percent) {
              return;
            }
            percents[index] = Math.round(progress.percent);
            const total = percents.reduce((a, b) => a + b, 0);
            const average = total / percents.length;
            onProgress(average);
            console.log('Processing: ' + average + '%');
          })
          .run();
      });
    })
  );

  await new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .on('end', () => {
        resolve(null);
      })
      .on('error', (err: Error) => {
        reject(err);
      })
      .thumbnail({
        count: thumbnailsCount,
        filename: `${outputFolder}${filename}_thumbnail.png`,
        size: '1280x720',
      });
  });

  // Create a master.m3u8 file
  const masterPlaylist = `${outputFolder}${filename}_master.m3u8`;
  const streamFilesContent = resolutions.map((resolution) => {
    return `#EXT-X-STREAM-INF:BANDWIDTH=${resolution.bandwidth},RESOLUTION=${resolution.size}\n${filename}_${resolution.resolution}.m3u8`;
  });
  const streamFiles = streamFilesContent.join('\n');
  const masterPlaylistContent = `#EXTM3U\n${streamFiles}`;
  await writeFile(masterPlaylist, masterPlaylistContent);

  return {
    transcodedFiles: await transcodedFiles,
    masterPlaylist,
    thumbnails: Array(thumbnailsCount)
      .fill(null)
      .map(
        (_, index) => `${outputFolder}${filename}_thumbnail_${index + 1}.png`
      ),
  };
}

export const transcodeService = {
  async transcode(inputPath: string, config: TConfig) {
    try {
      return await transcodeForStreaming(inputPath, config);
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};
