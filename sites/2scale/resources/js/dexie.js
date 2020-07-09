import Dexie from 'dexie';

const defineDB = () => {
    const db = new Dexie('2scale');
    db.version(1).stores({
        databases: 'name,data',
        charts: '++id,endpoint,filter,data'
    });
    return db;
};
export const db = defineDB();

export const storeDB = ({table, data, key}) => {
    db.open();
    db.transaction('rw', table, async () => {
        // Let's add some data to db:
        const res = await table.get(key);
        if (res === undefined) {
            await table.add(data);
        }
    }).catch(function(err) {
        console.error(err.stack || err);
    });
    return;
};
