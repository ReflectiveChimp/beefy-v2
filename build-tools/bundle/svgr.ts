import svgrPlugin from 'vite-plugin-svgr';
import { types as t } from '@babel/core';

export function standardSvgrPlugin() {
  return svgrPlugin({
    exclude: 'src/images/icons/mui/*.svg',
    svgrOptions: {
      expandProps: 'end',
      memo: true,
    },
  });
}

export function muiCompatSvgrPlugin() {
  return svgrPlugin({
    include: 'src/images/icons/mui/*.svg',
    svgrOptions: {
      expandProps: 'end',
      memo: true,
      svgProps: {
        focusable: 'false',
        'aria-hidden': 'true',
      },
      template: (variables, { tpl }) => {
        variables.props[0].name = 'tmpProps';
        const tmpProps = variables.props[0];
        const props = t.identifier('props');
        const clsx = t.identifier('clsx');
        const className = t.identifier('className');
        const importClsx = t.importDeclaration(
          [t.importDefaultSpecifier(clsx)],
          t.stringLiteral('clsx')
        );
        const mergeClassNameProp = t.variableDeclaration('const', [
          t.variableDeclarator(
            props,
            t.objectExpression([
              t.spreadElement(tmpProps),
              t.objectProperty(
                className,
                t.callExpression(clsx, [
                  t.stringLiteral('mui-svg'),
                  t.memberExpression(tmpProps, className),
                ])
              ),
            ])
          ),
        ]);

        return tpl`
${variables.imports};
${importClsx}

${variables.interfaces};

const ${variables.componentName} = (${variables.props}) => {
  ${mergeClassNameProp};
  return (${variables.jsx});
};

${variables.exports};
`;
      },
    },
  });
}
