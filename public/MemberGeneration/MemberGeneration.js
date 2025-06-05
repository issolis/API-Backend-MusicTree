import { Member } from '../tables/Member.js';
import { ActivityPeriodMember } from '../tables/ActivityPeriodMember.js';
import { Artist } from '../tables/Artist.js';

export class MemberGeneration {
  constructor({ members }) {
    this.members = members;  
  }

  async insert() {
    try {
      for (const memberData of this.members) {
        const artistResult = await Artist.getIdByName(memberData.artist_name);
        if (!artistResult.success) {
          console.error(`Artist not found: ${memberData.artist_name}`);
          continue;
        }
        const artist_id = artistResult.id;

        const member = new Member({
          artist_id,
          name: memberData.name,
          last_name1: memberData.last_name_1,
          last_name2: memberData.last_name_2 ?? null,
          instrument: memberData.instrument ?? null,
          is_active: memberData.is_active ?? true,
        });

        const memberInsertResult = await member.insert();
        if (!memberInsertResult.success) {
          console.error(`Failed to insert member: ${memberInsertResult.message}`);
          continue;
        }

        if (Array.isArray(memberData.activity_ranges)) {
          for (const period of memberData.activity_ranges) {
            const activityPeriod = new ActivityPeriodMember({
              member_id: memberInsertResult.id,
              startp: period[0],
              endp: period[1],
            });

            const activityInsertResult = await activityPeriod.insert();
            if (!activityInsertResult.success) {
              console.error(`Failed to insert activity period for member id ${memberInsertResult.id}: ${activityInsertResult.message}`);
            }
          }
        }
      }
      return { success: true, message: 'Members and activity periods inserted' };
    } catch (error) {
      console.error('Error in insert:', error.message);
      return { success: false, message: error.message };
    }
  }
}
