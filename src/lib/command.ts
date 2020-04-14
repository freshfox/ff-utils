import {spawn} from "child_process";

export class Command {

    constructor(private cmd: string, private args?: string[]) {
    }

    run(): Promise<string> {
        const cp = spawn(this.cmd, this.args, {
            stdio: 'pipe'
        });

        return new Promise((resolve, reject) => {
            const outStream = cp.stdout;
            const err = cp.stderr;

            cp.on('close', code => {
                if (code === 0 || code === null) {
                    return;
                }
                outStream.emit('error', `${this.cmd} has exited with error code ${code}.`);
            });

            cp.on('error', (err) => {
                console.error(err);
            });

            err.on('data', chunk => {
                console.log(chunk.toString('utf8'));
            });

            const buffers = [];
            outStream.on('data', chunk => {
                buffers.push(chunk);
            });

            outStream.on('end', () => {
                resolve(Buffer.concat(buffers).toString('utf8'));
            });
        });
    }

}
