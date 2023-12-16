import { getAllLinesFromMarkdownContent } from "src/utils/helpers";
import type { Transaction } from "../transactions-aggregator";

export class NewLineSeparatedTransactionParser {
	/*
	Converts new line separated raw transaction string into a Transaction object.

	Example of New Line Separated Raw Transaction string:
	
	#growth <-- tag
	2023-12-16 <-- date
	11:08 <-- time
	gain <-- type
	salary <-- details
	20000 <-- value
	From work <-- remarks

	*/
	parse(rawTransaction: string): Transaction {
		const txn = getAllLinesFromMarkdownContent(rawTransaction);

		const txnValue = Number.parseInt(txn[4]);

		return {
			date: txn[0] || "",
			time: txn[1] || "",
			type: txn[2] || "",
			details: txn[3] || "",
			value: txnValue,
			remarks: txn[5] || "",
		};
	}
}
