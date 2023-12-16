import { getAllLinesFromMarkdownContent } from "src/utils/helpers";
import type { Transaction } from "../transactions-aggregator";

export class NewLineSeparatedTransactionParser {
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
