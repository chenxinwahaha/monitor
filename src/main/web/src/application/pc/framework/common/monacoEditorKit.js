window.changeKeyBindings = function (editor,monaco) {
  editor.addAction({
    id: 'my-unique-id',
    label: 'Test: Add value',
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_D],
    contextMenuGroupId: 'Test',
    contextMenuOrder: 1,
    run: function (ed) {
      editor.trigger('', 'editor.action.deleteLines', {});
    }
  })

}
