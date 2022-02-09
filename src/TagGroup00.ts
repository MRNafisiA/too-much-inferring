import Entity from './type-query/types/Entity';
import {PostgresTypeMapper} from './type-query/types/Postgres';

type Model<Columns extends Entity['columns'], Requires extends readonly (keyof Columns)[], Optionals extends readonly (keyof Columns)[]> =
    {
        [key in Exclude<keyof Requires, keyof any[]> as Requires[key] extends keyof Columns ? Requires[key] : never]:
        Requires[key] extends keyof Columns ? { -readonly [key in keyof Columns]: PostgresTypeMapper<Columns[key]['type'], Columns[key]['nullable'], false> }[Requires[key]] : never;
    } &
    {
        [key in Exclude<keyof Optionals, keyof any[]> as Optionals[key] extends keyof Columns ? Optionals[key] : never]?:
        Optionals[key] extends keyof Columns ? { -readonly [key in keyof Columns]: PostgresTypeMapper<Columns[key]['type'], Columns[key]['nullable'], false> }[Optionals[key]] : never;
    };

namespace TagGroup00 {
    export const TagGroup = {
        code: 1,
        schema: 'public',
        title: 'n010_00_tag_group',
        columns: {
            id: {
                type: 'smallint',
                default: 'auto-increment',
                nullable: false,
                title: 'tag_group_id'
            },
            title: {
                type: 'varchar',
                length: 300,
                nullable: false,
                default: false
            },
            parentIDs: {
                type: 'jsonb',
                nullable: false,
                default: false,
                title: 'parents'
            },
            alias: {
                type: 'varchar',
                length: 20,
                nullable: false,
                default: false
            },
            aliasDashed: {
                type: 'varchar',
                length: 30,
                nullable: false,
                default: false,
                title: 'alias_dashed'
            },
            subGroupCodeLength: {
                type: 'smallint',
                nullable: false,
                default: false,
                title: 'sub_group_code_length'
            },
            lastSubGroupCode: {
                type: 'smallint',
                nullable: false,
                default: false,
                title: 'last_sub_group_code'
            },
            historyIDs: {
                type: 'jsonb',
                nullable: false,
                default: false,
                title: 'history'
            },
            companyIDs: {
                type: 'jsonb',
                nullable: false,
                default: false,
                title: 'companies'
            }
        }
    } as const;
    export type TagGroup<R extends readonly (keyof typeof TagGroup['columns'])[] = ['id', 'title', 'parentIDs', 'alias', 'aliasDashed', 'subGroupCodeLength', 'lastSubGroupCode', 'historyIDs', 'companyIDs'], O extends readonly (keyof typeof TagGroup['columns'])[] = []> = Model<typeof TagGroup['columns'], R, O>;
}

export default TagGroup00;