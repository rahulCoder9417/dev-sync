
export  const saveNode = (tree: any, nodeId: string, content: string) => {
    return tree.map((node: any) => {

      if (node.id === nodeId) {
        return { ...node, content };
      }
      if (node.children) {
        return { ...node, children: saveNode(node.children, nodeId, content) };
      }
      return node;
    });
  };