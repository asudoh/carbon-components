import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {
  SideNav as UIShellSideNav,
  SideNavItems,
  SideNavLink,
} from 'carbon-components-react/es/components/UIShell';
import SideNavFooter from './SideNavFooter';

/**
 * The side nav.
 */
class SideNav extends Component {
  static propTypes = {
    /**
     * The array of component data.
     */
    items: PropTypes.arrayOf(PropTypes.shape()).isRequired,

    /**
     * The ID of the selected component.
     */
    activeItemId: PropTypes.string,

    /**
     * The CSS class names.
     */
    className: PropTypes.string,

    /**
     * The handler for the `click` event for changing selection.
     */
    onItemClick: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
    };
  }

  handleItemClick = evt => {
    const { onItemClick = () => {} } = this.props;
    onItemClick(evt);
    evt.preventDefault();
  };

  handleToggle = () => {
    this.setState(({ expanded }) => ({ expanded: !expanded }));
  };

  render() {
    const { items, activeItemId, className } = this.props;
    const { expanded } = this.state;
    return (
      <UIShellSideNav
        className={className}
        expanded={expanded}
        isChildOfHeader={false}>
        <SideNavItems>
          {items
            .filter(item => !item.isHidden)
            .map(item => {
              const { id, name, label } = item;
              return (
                <SideNavLink
                  key={id}
                  data-nav-id={id}
                  isActive={id === activeItemId}
                  href={`/demo/${name}`}
                  onClick={this.handleItemClick}>
                  {label}
                </SideNavLink>
              );
            })}
        </SideNavItems>
        <SideNavFooter expanded={expanded} onToggle={this.handleToggle} />
      </UIShellSideNav>
    );
  }
}

export default SideNav;
