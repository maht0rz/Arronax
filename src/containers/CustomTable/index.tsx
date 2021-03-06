import * as React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import {
  getNetwork,
  getRows,
  getColumns,
  getPlatform,
  getEntity,
  getAttributes,
  getModalItem,
  getSort
} from '../../reducers/app/selectors';
import { getItemByPrimaryKey, submitQuery } from '../../reducers/app/thunks';
import { setSortAction } from '../../reducers/app/actions';
import CustomTableRow from '../../components/CustomTableRow';
import CustomTableHeader from '../../components/TableHeader';
import CustomPaginator from '../../components/CustomPaginator';
import EntityModal from 'components/EntityModal';
import { Sort } from '../../types';

const TableContainer = styled(Table)`
  width: 100%;
  background: #fff;
  border-radius: 4px;
`;

const Overflow = styled.div`
  overflow-x: auto;
`;

interface Props {
  rowsPerPage: number;
  items: any[];
  selectedColumns: any[];
  network: string;
  platform: string;
  selectedEntity: string;
  selectedModalItem: object;
  attributes: any[];
  isLoading: boolean;
  selectedSort: Sort;
  onExportCsv: () => void;
  getModalItemAction: (key: string, value: string | number) => void;
  onSubmitQuery: () => void;
  onSetSort: (orderBy: string, order: 'asc' | 'desc') => void;
}

interface State {
  page: number;
  isOpenedModal: boolean;
  selectedPrimaryKey: string;
  selectedPrimaryValue: string | number;
}

class CustomTable extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      page: 0,
      isOpenedModal: false,
      selectedPrimaryKey: '',
      selectedPrimaryValue: ''
    };
  }

  handleChangePage = page => {
    this.setState({ page });
  };

  handleRequestSort = async (property: string) => {
    const { selectedSort, onSetSort, onSubmitQuery } = this.props;
    let order: 'asc' | 'desc' = 'desc';
    if (selectedSort.orderBy === property && selectedSort.order === 'desc') {
      order = 'asc';
    }
    await onSetSort(property, order);
    onSubmitQuery();
  };

  onCloseModal = () => this.setState({isOpenedModal: false});

  onOpenModal = (key, value) => {
    const { selectedPrimaryKey, selectedPrimaryValue } = this.state;
    const { getModalItemAction } = this.props;
    if (selectedPrimaryKey !== key || selectedPrimaryValue !== value) {
      getModalItemAction(key, value);
      this.setState({selectedPrimaryKey: key, selectedPrimaryValue: value, isOpenedModal: true});
    }
    this.setState({isOpenedModal: true});
  }

  render() {
    const {
      items,
      network,
      selectedColumns,
      rowsPerPage,
      platform,
      selectedEntity,
      selectedModalItem,
      attributes,
      selectedSort,
      isLoading,
      onExportCsv
    } = this.props;
    const { page, isOpenedModal} = this.state;
    const rowCount = rowsPerPage !== null ? rowsPerPage : 10;
    const realRows = items.slice(
      page * rowCount,
      page * rowCount + rowCount
    );
    return (
      <React.Fragment>
        <Overflow>
          <TableContainer>
            <CustomTableHeader
              rows={selectedColumns}
              order={selectedSort.order}
              orderBy={selectedSort.orderBy}
              createSortHandler={this.handleRequestSort}
            />
            <TableBody>
              {realRows.map((row, index) => {
                return (
                  <CustomTableRow
                    network={network}
                    selectedColumns={selectedColumns}
                    key={index}
                    item={row}
                    platform={platform}
                    selectedEntity={selectedEntity}
                    onClickPrimaryKey={this.onOpenModal}
                  />
                );
              })}
            </TableBody>
          </TableContainer>
        </Overflow>
        <CustomPaginator
          rowsPerPage={rowCount}
          page={page}
          totalNumber={items.length}
          onChangePage={this.handleChangePage}
          onExportCsv={onExportCsv}
        />
        <EntityModal
          open={isOpenedModal}
          selectedEntity={selectedEntity}
          attributes={attributes}
          item={selectedModalItem}
          isLoading={isLoading}
          onClose={this.onCloseModal}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => ({
  rowsPerPage: getRows(state),
  network: getNetwork(state),
  selectedColumns: getColumns(state),
  platform: getPlatform(state),
  selectedEntity: getEntity(state),
  selectedModalItem: getModalItem(state),
  attributes: getAttributes(state),
  selectedSort: getSort(state)
});

const mapDispatchToProps = dispatch => ({
  getModalItemAction: (key, value) => dispatch(getItemByPrimaryKey(key, value)),
  onSubmitQuery: () => dispatch(submitQuery()),
  onSetSort: (orderBy: string, order: 'asc' | 'desc') => dispatch(setSortAction(orderBy, order))
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomTable);
