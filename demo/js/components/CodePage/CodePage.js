import React from 'react';
import PropTypes from 'prop-types';
import Markdown from 'markdown-it';

import ComponentExample from '../ComponentExample/ComponentExample';

/**
 * The page to show the component demo, its code as well as its README.
 */
const CodePage = ({ metadata, hideViewFullRender }) => {
  const md = new Markdown({ html: true });
  const subItems = (metadata.items || []).filter(item => !item.isHidden);
  /* eslint-disable react/no-danger */
  const componentContent =
    !metadata.isCollection && subItems.length <= 1 ? (
      <ComponentExample hideViewFullRender={hideViewFullRender} component={metadata.name} htmlFile={metadata.renderedContent} />
    ) : (
      subItems.map(item => (
        <div key={item.id} className="component-variation">
          <h2 className="component-variation__name">{item.label}</h2>
          {item.notes && metadata.notes !== item.notes && <p>{item.notes}</p>}
          <ComponentExample variant={item.handle} component={metadata.name} htmlFile={item.renderedContent} />
        </div>
      ))
    );

  return (
    <div className="page code-page test">
      {componentContent}
      {metadata.notes && <div className="page_md" dangerouslySetInnerHTML={{ __html: md.render(metadata.notes) }} />}
    </div>
  );
  /* eslint-enable react/no-danger */
};

CodePage.propTypes = {
  /**
   * The component data.
   */
  metadata: PropTypes.shape().isRequired,

  /**
   * `true` to hide "full render" link.
   */
  hideViewFullRender: PropTypes.bool,
};

export default CodePage;
