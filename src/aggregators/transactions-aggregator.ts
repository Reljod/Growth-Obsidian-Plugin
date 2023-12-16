import type { TFile, Vault } from "obsidian";
import { TAG_FORMAT } from "src/constants";
import {
	combineMarkdownContentLines,
	getAllLinesFromMarkdownContent,
} from "src/utils/helpers";

export type Transaction = {
	date: string;
	time: string;
	type: string;
	details: string;
	value: number;
	remarks: string;
};

interface TransactionParser {
	parse(rawTransaction: string): Transaction;
}

export class TransactionAggregator {
	private _vault: Vault;
	private _txnParser: TransactionParser;
	private _formattedTags: string[];

	constructor(vault: Vault, txnParser: TransactionParser) {
		this._vault = vault;
		this._txnParser = txnParser;

		// TODO: Move this to settings
		const tags = ["growth"];
		this._formattedTags = tags.map((tag) => TAG_FORMAT.replace("%s", tag));
	}

	async aggregate(files: TFile[]): Promise<Transaction[]> {
		const mutTransactions: Transaction[] = [];

		for (let file of files) {
			await this.insertTransactionsFromFile(mutTransactions, file);
		}

		return mutTransactions;
	}

	private async insertTransactionsFromFile(
		mutTransactions: Transaction[],
		file: TFile,
	) {
		const contentRaw = await this._vault.cachedRead(file);
		const contentRawLines = getAllLinesFromMarkdownContent(contentRaw);

		let scanner = 0;
		while (scanner < contentRawLines.length) {
			if (!this.isLineStartsWithTag(contentRawLines[scanner].trim())) {
				scanner++;
				continue;
			}

			scanner++;
			const transactions = [];
			while (
				contentRawLines[scanner] &&
				contentRawLines[scanner].trim() != ""
			) {
				transactions.push(contentRawLines[scanner].trim());
				scanner++;
			}

			if (transactions.length > 0) {
				mutTransactions.push(this.parseRawTransactions(transactions));
			}
		}
	}

	private parseRawTransactions(rawTransactions: string[]): Transaction {
		return this._txnParser.parse(
			combineMarkdownContentLines(rawTransactions),
		);
	}

	private isLineStartsWithTag(line: string): boolean {
		return this._formattedTags.some((tag) =>
			line.toLowerCase().startsWith(tag),
		);
	}
}
