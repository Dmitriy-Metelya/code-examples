import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ConnectStoreHOC from 'startup/connect_store_hoc';

import { deleteEoToDos, fetchEoToDo, sendEoToDoEmail, updateEoToDo } from 'api/eoToDo';

import EoToDosEmailAreaComponent from './EoToDosEmailAreaComponent';

import { optionsList } from 'common/prop_types_shapes';

const EoToDosEmailAreaContainer = ({
  dispatch,
  immutableUsersOptions,
  setSelectedEoToDoId,
  selectedEoToDoId,
}) => {
  const [selectedEoToDo, setSelectedEoToDo] = useState({});

  React.useEffect(() => {
    async function fetchCurrentEoToDo() {
      const newSelectedEoToDo = await fetchEoToDo(dispatch, selectedEoToDoId);

      setSelectedEoToDo(newSelectedEoToDo);
    }

    selectedEoToDoId ? fetchCurrentEoToDo() : setSelectedEoToDo({});
  }, [dispatch, selectedEoToDoId]);

  async function handleAssignEoToDo(id, userId) {
    const resp = await updateEoToDo(dispatch, { id, userId });

    return !!resp;
  }

  function handleDeleteEoToDo(id) {
    return async () => {
      const resp = await deleteEoToDos(dispatch, [id]);

      resp && setSelectedEoToDoId(null);
    };
  }

  function handleSendEmail(eoToDo) {
    return async () => {
      const { body, eoToDoId: id, subject } = eoToDo;
      const email = { htmlBody: body, subject };

      const resp = await sendEoToDoEmail(dispatch, id, email);

      resp && setSelectedEoToDoId(null);
    };
  }

  return (
    <EoToDosEmailAreaComponent
      handleAssignEoToDo={handleAssignEoToDo}
      handleDeleteEoToDo={handleDeleteEoToDo}
      handleSendEmail={handleSendEmail}
      immutableUsersOptions={immutableUsersOptions}
      selectedEoToDo={selectedEoToDo}
    />
  );
};

EoToDosEmailAreaContainer.propTypes = {
  dispatch: PropTypes.func,
  immutableUsersOptions: optionsList,
  selectedEoToDoId: PropTypes.number,
  setSelectedEoToDoId: PropTypes.func,
};

export default ConnectStoreHOC(connect()(EoToDosEmailAreaContainer));
