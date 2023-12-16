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
import { TagFilter } from "./aggregators/filters/tag-filter";

// Remember to rename these classes and interfaces!

interface GrowthPluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: GrowthPluginSettings = {
	mySetting: "default",
};

export default class GrowthPlugin extends Plugin {
	settings: GrowthPluginSettings | undefined;

	async onload() {
		await this.loadSettings();

		console.log("Loading growth plugin");

		const tagFilter = new TagFilter(this.app.vault);
		const fileAggregator = new FileAggregator(this.app.vault, [tagFilter]);

		this.registerView(
			GROWTH_VIEW_TYPE,
			(leaf) => new RightSideBarView(leaf),
		);

		// This creates an icon in the left ribbon.
		this.addRibbonIcon("sprout", "Growth!", async (evt: MouseEvent) => {
			const { workspace } = this.app;
			const files = await fileAggregator.aggregateFiles();
			// TODO: Remove console log that prints each file path
			files.forEach((file) => console.log(file.path));

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
						if (this.plugin.settings){
							this.plugin.settings.mySetting = value;
							await this.plugin.saveSettings();
						}
					}),
			);	
	}
}
