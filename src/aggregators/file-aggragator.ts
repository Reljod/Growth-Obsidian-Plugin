import type { Vault, TFile } from "obsidian";

interface FileFilter {
	isIncluded(file: TFile): Promise<boolean>;
}

export class FileAggregator {
	private _vault: Vault;
	private _fileFilters: FileFilter[];

	constructor(vault: Vault, fileFilters: FileFilter[] = []) {
		this._vault = vault;
		this._fileFilters = fileFilters;
	}

	async aggregateFiles() {
		const files = this._vault.getMarkdownFiles();

		const filteredFiles = [];
		for (let file of files) {
			if (await this.filterFile(file)) {
				filteredFiles.push(file);
			}
		}

		return filteredFiles;
	}

	private async filterFile(file: TFile): Promise<boolean> {
		for (let filter of this._fileFilters) {
			if (!(await filter.isIncluded(file))) {
				return false;
			}
		}

		return true;
	}
}
