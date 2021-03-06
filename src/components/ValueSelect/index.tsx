import * as React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import { convertValue } from '../../utils/general';

const Container = styled.div``;

const ButtonShell = styled(Button)`
  &&& {
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    cursor: pointer;
    color: ${({ isactive }) => (isactive ? '#4A4A4A' : '#9b9b9b')};
    text-transform: capitalize;
  }
`;

const NestedTitle = styled.div`
  cursor: default;
  flex-shrink: 0;
  outline: none;
  padding: 5px 25px 0 25px;
  color: #9b9b9b;
  font-family: Roboto-Medium;
  font-size: 16px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: capitalize;
`;

const ArrowIcon = styled(KeyboardArrowDown)`
  color: #56c2d9;
  margin-left: 7px;
`;

const MenuContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
`;

const MenuContents = styled.div`
  max-height: 368px;
  flex: 1;
  outline: none;
  overflow: auto;
  min-height: 1.25em;
`;

const MainMenuItem = styled(MenuItem)`
  &&& {
    &[class*='selected'] {
      background-color: rgba(101,  200, 206, 0.13);
    }
    &:hover {
      background-color: rgba(101,  200, 206, 0.1);
    }
    font-size: 20px;
    font-weight: 300;
    padding-left: 25px;
    padding-right: 25px;
    color: #4a4a4a;
  }
`;

interface Props {
  selectedValue: string;
  values: Array<string>;
  placeholder?: string;
  onChange: (value: object) => void;
}

type States = {
  anchorEl: boolean;
};

class ValueSelect extends React.Component<Props, States> {
  static defaultProps = {
    values: [],
    selectedValue: ''
  };
  state = {
    anchorEl: null,
  };

  handleChange = value => {
    const { onChange } = this.props;
    onChange(value);
    this.setState({ anchorEl: null });
  };

  cancelChange = () => {
    this.setState({ anchorEl: null });
  };

  handleClick = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  render() {
    const { anchorEl } = this.state;
    const { values, selectedValue, placeholder } = this.props;
    const menuTitle = selectedValue ? selectedValue : placeholder;

    return (
      <Container>
        <ButtonShell
          aria-owns={anchorEl ? 'simple-menu' : undefined}
          aria-haspopup="true"
          isactive={!!selectedValue? 1:0}
          onClick={this.handleClick}
        >
          {menuTitle}
          <ArrowIcon />
        </ButtonShell>
        <MenuContainer>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={this.cancelChange}
            PaperProps={{
              style: {
                position: 'relative',
                width: 300,
              },
            }}
          >
            <NestedTitle>{placeholder}</NestedTitle>
            <MenuContents>
              {values.map((value, index) => (
                <MainMenuItem
                  onClick={() => this.handleChange(value)}
                  key={index}
                  selected={value === selectedValue}
                >
                  {convertValue(value)}
                </MainMenuItem>
              ))}
            </MenuContents>
          </Menu>
        </MenuContainer>
      </Container>
    );
  }
}

export default ValueSelect;
