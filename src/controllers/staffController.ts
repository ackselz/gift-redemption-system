import * as fs from "fs";
import * as path from "path";
import { parse } from "csv/sync";
import { Staff } from "src/types";

const STAFF_ID_TO_TEAM_MAPPING_FILE = "data/staff-id-to-team-mapping-long.csv";

/**
 * Deserialize staffs data from a CSV file.
 * @returns An array of Staff objects.
 */
export function deserializeStaffs(): Staff[] {
  console.log("\n> Deserializing staffs...");
  let records: Staff[] = [];
  try {
    const data = fs.readFileSync(
      path.resolve(__dirname, STAFF_ID_TO_TEAM_MAPPING_FILE),
      "utf8",
    );
    records = parse(data, {
      bom: true, //  https://csv.js.org/parse/options/bom/
      cast: (value, context) => {
        // https://csv.js.org/parse/options/cast/
        if (context.header) return value;
        if (context.column === "created_at") return Number(value);
        return String(value);
      },
      columns: true, // https://csv.js.org/parse/options/columns/
    });
  } catch (error) {
    console.error("Error reading staff id to team mapping file");
    console.error(error);
  }
  console.log(`> Deserialized ${records.length} staffs`);
  return records;
}

/**
 * Retrieves a staff member based on their staff pass ID.
 * @param staff_pass_id - The staff pass ID of the staff member to retrieve.
 * @returns The staff member object if found, otherwise undefined.
 */
export function getStaff(staff_pass_id: string): Staff | undefined {
  return staffRecords.find((record) => record.staff_pass_id === staff_pass_id);
}

// Initialize staff records
export const staffRecords: Staff[] = deserializeStaffs();