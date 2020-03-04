import algoliasearch from 'algoliasearch';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
};

class Algolia {
    constructor() {

        this.algolia_client = algoliasearch('YLEE8RLU7T', process.env.REACT_APP_ALGOLIA_SECRET);
        this.algolia_index = this.algolia_client.initIndex('monumenta-item-index');

    }
}
export default Algolia;
