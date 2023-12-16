import {
	App,
	Modal,
	Plugin,
	PluginSettingTab,
	Setting,
	WorkspaceLeaf,
} from "obsidian";
import { GROWTH_VIEW_TYPE } from "./constants";
import { RightSideBarView } from "./views/right-side-bar-view";
import { FileAggregator } from "./aggregators/file-aggregator";
import { TagFilter } from "./aggregators/filters/tag-filter";
import { TransactionAggregator, type Transaction } from "./aggregators/transactions-aggregator";
import { NewLineSeparatedTransactionParser } from "./aggregators/parsers/transaction-parser";

// Remember to rename these classes and interfaces!

interface GrowthPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: GrowthPluginSettings = {
	mySetting: "default",
};

export default class GrowthPlugin extends Plugin {
	settings: GrowthPluginSettings | undefined;
	transactions: Transaction[] | undefined;

	async onload() {
		await this.loadSettings();

		console.log("Loading growth plugin");

		const tagFilter = new TagFilter(this.app.vault);
		const fileAggregator = new FileAggregator(this.app.vault, [tagFilter]);
		const txnParser = new NewLineSeparatedTransactionParser();
		const txnAggregator = new TransactionAggregator(
			this.app.vault,
			txnParser,
		);

		const files = await fileAggregator.aggregateFiles();
		this.transactions = await txnAggregator.aggregate(files);

		this.registerView(
			GROWTH_VIEW_TYPE,
			(leaf) => new RightSideBarView(leaf),
		);

		// This creates an icon in the left ribbon.
		this.addRibbonIcon("sprout", "Growth!", async (evt: MouseEvent) => {
			const { workspace } = this.app;

			// TODO: Remove console log that prints each file path
			this.transactions && this.transactions.forEach((txn) => console.log(txn));

			let leaf: WorkspaceLeaf | null = null;
			const leaves = workspace.getLeavesOfType(GROWTH_VIEW_TYPE);

			if (leaves.length > 0) {
				// A leaf with our view already exists, use that
				leaf = leaves[0];
			} else {
				// Our view could not be found in the workspace, create a new leaf
				// in the right sidebar for it
				leaf = workspace.getRightLeaf(false);
				await leaf.setViewState({
					type: GROWTH_VIEW_TYPE,
					active: true,
				});
			}

			// "Reveal" the leaf in case it is in a collapsed sidebar
			workspace.revealLeaf(leaf);
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));
	}

	onunload() {
		console.log("Unloading growth plugin...");
		if (this.transactions) this.transactions.length = 0
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData(),
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class SampleModal extends Modal {
	constructor(app: App) {
		super(app);
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.setText("Woah!");
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: GrowthPlugin;

	constructor(app: App, plugin: GrowthPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Setting #1")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings?.mySetting || "")
					.onChange(async (value) => {
						if (this.plugin.settings) {
							this.plugin.settings.mySetting = value;
							await this.plugin.saveSettings();
						}
					}),
			);
	}
}
