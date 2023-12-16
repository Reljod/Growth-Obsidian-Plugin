import { ItemView, WorkspaceLeaf } from "obsidian";
import { GROWTH_VIEW_TYPE } from "../../constants";

import Component from "./index.svelte";

export class RightSideBarView extends ItemView {
	component: Component | undefined;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
	}

	getViewType() {
		return GROWTH_VIEW_TYPE;
	}

	getDisplayText() {
		return "Your Financial Panel";
	}

	async onOpen() {
		this.component = new Component({
			target: this.contentEl,
			props: {
				title: this.getDisplayText(),
			},
		});
	}

	async onClose() {
		this.component?.$destroy();
	}
}
