import https from "https";

export interface Block {
    hash: string;
    // unix time
    time: number;
    height: number;
    prev_block?: string;
    next_block?: string[];
}

export async function getLatestBlock(): Promise<Block> {
    return new Promise((res, rej) => {
        const request = https.get(`https://blockchain.info/latestblock`, response => {
            let responseBody = '';
            response.on('data', chunk => responseBody += chunk.toString());
            response.on('end', () => res(JSON.parse(responseBody)));
        });


        
        request.on('error', rej);
        request.end();
    })
}

export async function getBlockByHeight(height: number): Promise<Block> {
    return new Promise((res, rej) => {
        const request = https.get(`https://blockchain.info/block-height/${height}?format=json`, response => {
            let responseBody = '';
            response.on('data', chunk => responseBody += chunk.toString());
            response.on('end', () => res(JSON.parse(responseBody).blocks[0]));
        });


        
        request.on('error', rej);
        request.end();
    })
}