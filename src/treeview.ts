import vscode from "vscode";

/**
 * Common parameters for Tree Items
 */
export type TreeNodeParameters = {
  icon?: string
  color?: string
  state?: vscode.TreeItemCollapsibleState
  parent?: TreeNode
};

export type RevealOptions = { select?: boolean; focus?: boolean; expand?: boolean | number };

/**
 * A boilerplate class to create Tree Items that can provide children nodes.
 * Intended to be extended into a base class that provides a refreshCommand.
 * 
 * Example:
```
class MyBaseNode extends TreeNode {
   constructor(label: string, params?: TreeNodeParameters) {
      super(label, "myExtension.myTreeView.refreshItem", params);
   }
}
```
 */
export abstract class TreeNode extends vscode.TreeItem {
  /**
   * 
   * @param label the node's displayed label
   * @param refreshCommand the name of the command that can refresh this node
   * @param params optional parameters to set an icon, a color, etc
   * @param revealCommand the name of the command that can reveal this node
   */
  constructor(label: string, readonly refreshCommand: string, readonly params?: TreeNodeParameters, readonly revealCommand?: string) {
    super(label, params?.state);
    this.iconPath = params?.icon ? new vscode.ThemeIcon(params.icon, params.color ? new vscode.ThemeColor(params.color) : undefined) : undefined;
  }

  get parent() {
    return this.params?.parent;
  }

  getChildren?(): vscode.ProviderResult<TreeNode[]>;

  async refresh() {
    await vscode.commands.executeCommand<void>(this.refreshCommand, this);
  }

  async reveal(options?: RevealOptions) {
    if (this.revealCommand) {
      await vscode.commands.executeCommand<void>(this.revealCommand, this, options);
    }
  }
}

/**
 * A boilerplate class to easily create a new Tree View.
 * The `refresh()` method should be called by a command whose name should be passed onto the {@link TreeNode} constructor.
 */
export abstract class TreeNodeDataProvider<T> implements vscode.TreeDataProvider<TreeNode> {
  private readonly emitter = new vscode.EventEmitter<TreeNode | TreeNode[] | undefined | null | void>();
  readonly onDidChangeTreeData = this.emitter.event;

  getTreeItem(element: TreeNode) {
    return element;
  }

  getChildren(element?: TreeNode | undefined): vscode.ProviderResult<TreeNode[]> {
    if (element) {
      return element.getChildren?.();
    }
    else {
      return this.getRootElements();
    }
  }

  getParent(element: TreeNode) {
    return element.parent;
  }

  refresh(element?: TreeNode) {
    this.emitter.fire(element);
  }

  abstract getRootElements(): vscode.ProviderResult<TreeNode[]>;
}