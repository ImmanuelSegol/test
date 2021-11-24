import { Block, getBlockByHeight, getLatestBlock } from "./blockchainsApi";

export default class QueryBlock {
    public async queryGetBlockByUNIXTimestamp(unixTimestamp: number): Promise<Block> {
        const { genesisBlock, latestBlock, averageTimeToCreateBlock } = await this.getBlockchainStats();

        if (unixTimestamp <= genesisBlock.time || unixTimestamp >= latestBlock.time) {
            throw new Error("TIMESTAMP IS OUT OF BOUNDS");
        }

        const possibleBlockHeight = Math.ceil(Math.abs(unixTimestamp - genesisBlock.time) / averageTimeToCreateBlock)
        const possibleBlock = await getBlockByHeight(possibleBlockHeight);

        const finalBlock = await this.shrinkSearchRange(unixTimestamp, possibleBlock, averageTimeToCreateBlock)

        return finalBlock;
    }

    private async shrinkSearchRange(unixTimestamp: number, bestCandidateBlock: Block, averageTimeToCreateBlock: number): Promise<Block> {
        if (bestCandidateBlock.time === unixTimestamp) {
            return bestCandidateBlock;
        } 

    
        const timeRange = unixTimestamp - bestCandidateBlock.time;
        let amountOfBlocksInTimeRange = Math.ceil((unixTimestamp - bestCandidateBlock.time) / averageTimeToCreateBlock);        
        
        let nextCandidateBlock!: Block;
        if (amountOfBlocksInTimeRange == 0) {
            const shiftBy = timeRange > 0 ? 1 : -1;
            nextCandidateBlock = await getBlockByHeight(bestCandidateBlock.height + shiftBy);
        } else {
            nextCandidateBlock = await getBlockByHeight(bestCandidateBlock.height + amountOfBlocksInTimeRange);
        }
        
        const timeDiff = bestCandidateBlock.time - nextCandidateBlock.time;
        const heightDiff = bestCandidateBlock.height - nextCandidateBlock.height;
        const averageTimeToCreateBlockInTimeSpanBetweenPossibleBlocks = Math.ceil(Math.abs(timeDiff / heightDiff));

        return this.shrinkSearchRange(unixTimestamp, nextCandidateBlock, averageTimeToCreateBlockInTimeSpanBetweenPossibleBlocks);
    }

    private async getBlockchainStats(): Promise<{
        genesisBlock: Block,
        latestBlock: Block,
        averageTimeToCreateBlock: number
    }> {
        const [latestBlock, genesisBlock] = await Promise.all([getLatestBlock(), getBlockByHeight(0)]);
        const averageTimeToCreateBlock = Math.ceil((latestBlock.time - genesisBlock.time) / latestBlock.height);
        
        return {
            latestBlock,
            genesisBlock,
            averageTimeToCreateBlock,
        }
    };
}
