// gen.ia creator — Plugin Figma
// TODO: implementar lógica principal após definição de stack com @architect
figma.showUI(__html__, { width: 480, height: 640 });

figma.ui.onmessage = (msg) => {
  if (msg.type === 'close') figma.closePlugin();
};
