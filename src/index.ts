import {Client} from './type-query';
import TagGroup00 from './TagGroup00';
import TagGroup = TagGroup00.TagGroup;


const removeTagGroup00 = async (
    client: Client,
    removingID: TagGroup['id'],
) => {
    const companyIDs = [1, 2, 3, 4];
    const historyIDs = [1, 2, 3, 4];
    const tagGroups = await client.Select(TagGroup, tq => ({
        select: ['id', 'companyIDs'] as const,
        where: tq.orScope([tq.eqOp(tq.col('id'), tq.val(removingID)), tq.jIsOp(tq.col('parentIDs'), tq.val(removingID.toString()))])
    })).then(e => e.length === 0 ? false as const : e).catch(_ => false as const);
    if (!tagGroups) {
        return 302;
    }

    // IMPORTANT AREA START
    // Correct
    const removingIDs: TagGroup['id'][] = [];
    const editingIDs: TagGroup['id'][] = [];
    // Incorrect
    // const removingIDs = [];
    // const editingIDs = [];
    // IMPORTANT AREA END


    for (const tagGroup of tagGroups) {
        if (removingID === tagGroup.id && !companyIDs.every(e => (tagGroup.companyIDs as number[]).includes(e))) {
            return 301;
        }
        if (companyIDs.length === tagGroup.companyIDs.length) {
            removingIDs.push(tagGroup.id);
        } else {
            editingIDs.push(tagGroup.id);
        }
    }
    const affectingIDs = [...editingIDs, ...removingIDs];
    if (editingIDs.length !== 0) {
        const editedTagGroups = await client.UpdateExpression(TagGroup, tq => ({
            select: ['id'] as const,
            // where: tq.inOp(tq.col('id'), editingIDs.map(e => tq.val(e))),
            sets: {
                companyIDs: tq.jArrMinus(tq.col('companyIDs'), companyIDs.map(e => tq.val(e.toString()))),
                historyIDs: tq.swt({
                    cases: editingIDs.map((v, i) => ({
                        when: tq.eqOp(tq.col('id'), tq.val(v)),
                        then: tq.con([tq.col('historyIDs'), tq.val([historyIDs[i]])])
                    }))
                })
            }
        })).then(e => e.length === editingIDs.length ? e : false as const).catch(_ => false as const);
        if (!editedTagGroups) {
            return 400;
        }
    }
    if (removingIDs.length !== 0) {
        const removedTagGroups = await client.Delete(TagGroup, tq => ({
            select: ['id'] as const,
            where: tq.inOp(tq.col('id'), removingIDs.map(e => tq.val(e)))
        })).then(e => e.length === removingIDs.length ? e : false as const).catch(_ => false as const);
        if (!removedTagGroups) {
            return 400;
        }
    }

    return {code: 7898, data: {ids: affectingIDs}} as const;
};

export default removeTagGroup00;
export {TagGroup};