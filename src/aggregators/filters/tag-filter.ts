import type { TFile, Vault } from "obsidian";
import { TAG_FORMAT } from "src/constants";

export class TagFilter {
	private _vault: Vault;
	private _formattedTags: string[];

	constructor(vault: Vault) {
		this._vault = vault;

		// TODO: Move this to settings
		const tags = ["growth"];
		this._formattedTags = tags.map((tag) => TAG_FORMAT.replace("%s", tag));
	}

	async isIncluded(file: TFile): Promise<boolean> {
		const rawFile = await this._vault.cachedRead(file);
		return this.checkIfTagContained(rawFile);
	}

	private checkIfTagContained(text: string): boolean {
		for (let tag of this._formattedTags) {
			if (text.includes(tag)) {
				return true;
			}
		}

		return false;
	}
}
