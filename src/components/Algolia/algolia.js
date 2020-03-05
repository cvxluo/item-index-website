import algoliasearch from 'algoliasearch';

class Algolia {
    constructor() {

        this.algolia_client = algoliasearch('YLEE8RLU7T', process.env.REACT_APP_ALGOLIA_SECRET);
        this.algolia_index = this.algolia_client.initIndex('monumenta-item-index');

    }
}
export default Algolia;
