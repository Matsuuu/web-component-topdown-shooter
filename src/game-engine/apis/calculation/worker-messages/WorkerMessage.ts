interface WorkerMessage {
    sourceEntity: number;
    action: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
}
