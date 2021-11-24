import QueryBlock from './queryBlock';

async function main() {
    const query = new QueryBlock();
    const unixTimestamp = 1232108688;
    const block = await query.queryGetBlockByUNIXTimestamp(unixTimestamp);
    console.log(`Block number ${block.height} has been created on date ${new Date(unixTimestamp * 1000).toLocaleDateString("en-US")}`);
    console.log(`Previous block is: ${block.prev_block}`);
    console.log(`Next block is: ${block.next_block}`);
}

main().catch(e => {
    console.error(e);
})

