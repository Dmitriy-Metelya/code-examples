import React from 'react';
import PropTypes from 'prop-types';

import { cloneDeep, isEmpty, set } from 'lodash';

import EoEmailForm from 'components_linkio/EoEmailForm';
import ButtonComponent from 'components_linkio/button_component';
import Select from 'components_linkio/Select';

import { eoToDoShape } from 'common/propTypesShapes/eoToDos';

import { optionsList } from 'common/prop_types_shapes';

import { translate } from 'common/i18n';

import './eoToDosEmailArea.scss';

const initialState = {
  userId: null,
  body: '',
  eoToDoId: null,
  subject: '',
  toDosType: '',
  errors: {},
};

function reducer(state, action) {
  const { value, type } = action;

  const newState = cloneDeep(state);

  switch (type) {
    case 'setState':
      return { ...newState, ...value };
    default: {
      set(newState, type, value);

      return newState;
    }
  }
}

const EoToDosEmailAreaComponent = ({
  handleAssignEoToDo,
  handleDeleteEoToDo,
  handleSendEmail,
  immutableUsersOptions,
  selectedEoToDo,
}) => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const isEoToDoSelected = !isEmpty(selectedEoToDo);

  React.useEffect(() => {
    const { id: eoToDoId, body, subject, toDosType, userId } = selectedEoToDo;

    isEoToDoSelected &&
      dispatch({ type: 'setState', value: { eoToDoId, body, subject, toDosType, userId } });
  }, [dispatch, JSON.stringify(selectedEoToDo)]);

  const { eoToDoId, userId, body, errors, subject, toDosType } = state;

  const isToDoTypeReply = toDosType === 'reply';

  const assigneeOptions = immutableUsersOptions.toJS();

  async function handleSelectAssignee(option) {
    const value = option ? option.value : null;

    const isSuccessfullyAssigned = await handleAssignEoToDo(eoToDoId, value);

    isSuccessfullyAssigned && dispatch({ type: 'userId', value });
  }

  function setEmailSubjectValue(event) {
    dispatch({ type: 'subject', value: event.target.value });
  }

  function setEmailBodyValue(value) {
    dispatch({ type: 'body', value });
  }

  return (
    <div className="eo-to-dos-email-area">
      {!isEoToDoSelected && (
        <div className="eo-to-dos-email-area__no-task-selected-message">
          {translate('eoToDo.noTaskSelectedMessage')}
        </div>
      )}
      {isEoToDoSelected && (
        <div className="eo-to-dos-email-area__email-form-wrapper">
          <div className="eo-to-dos-email-area__assigned-to-wrapper">
            <Select
              isClearable
              placeholder={translate(`eoToDo.emailArea.assignedToSelectDefaultValue`)}
              onChange={handleSelectAssignee}
              options={assigneeOptions}
              triggerChangeOnBlur={false}
              value={assigneeOptions.find(({ value }) => value === userId) || null}
              wrapperClassName="eo-to-dos-email-area__assigned-to-select"
            />
          </div>

          <EoEmailForm
            emailBody={body}
            emailSubject={subject}
            errors={errors}
            isDisabled={isToDoTypeReply}
            setEmailBodyValue={setEmailBodyValue}
            setEmailSubjectValue={setEmailSubjectValue}
          />

          <div className="eo-to-dos-email-area__buttons-wrapper">
            <ButtonComponent isRed onClick={handleDeleteEoToDo(eoToDoId)}>
              {translate('eoToDo.emailArea.buttons.delete')}
            </ButtonComponent>

            {!isToDoTypeReply && (
              <ButtonComponent isGreen onClick={handleSendEmail(state)}>
                {translate('eoToDo.emailArea.buttons.sendEmail')}
              </ButtonComponent>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

EoToDosEmailAreaComponent.propTypes = {
  handleAssignEoToDo: PropTypes.func,
  handleDeleteEoToDo: PropTypes.func,
  handleSendEmail: PropTypes.func,
  immutableUsersOptions: optionsList,
  selectedEoToDo: eoToDoShape,
};

export default EoToDosEmailAreaComponent;
