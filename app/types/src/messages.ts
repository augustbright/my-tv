export type TMessage =
  | {
      type: 'dummy-notification';
      message: string;
    }
  | {
      type: 'upload-progress';
      jobId: string;
      percent: number;
    }
  | {
      type: 'upload-finished';
      jobId: string;
    }
  | {
      type: 'upload-error';
      jobId: string;
      error: string;
    };
