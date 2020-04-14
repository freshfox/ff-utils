import {Readable} from "stream";

export async function collectStream(readable: Readable): Promise<Buffer> {
    const chunks = [];
    for await (let chunk of readable) {
        chunks.push(chunk)
    }
    return Buffer.concat(chunks);
}
