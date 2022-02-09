import pool from './type-query';
import removeTagGroup00 from './index';

test('remove', () =>
    pool.transaction(async (client) => {
            return removeTagGroup00(
                client,
                3
            );
        }
    ).catch(e => {
        pool.$.end();
        if (e === 'test-succeed') {
            return 'test-succeed';
        } else {
            throw e;
        }
    }));