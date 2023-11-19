// withdrawal form dialog component

import React, {useEffect, useState} from 'react';
import {Recurring} from '../../model/Base/Recurring';

interface WithdrawalFormDialogProps {
    user: string;
    scenarioId: string;
    isOpen: boolean;
    onClose: () => void;
    onSave: (recurring: Recurring) => void;
    inititalRecurring?: Recurring
}

const WithdrawalFormDialog: React.FC<WithdrawalFormDialogProps> = ({
  isOpen,
  user,
  scenarioId,
  inititalRecurring,
  onClose,
  onSave}) => {
  const [recurring, setRecurring] = useState((inititalRecurring || new Recurring(`${user}#${scenarioId}`)));

  useEffect(() => {
    setRecurring(inititalRecurring || new Recurring(`${user}#${scenarioId}`));
  }, [inititalRecurring, user, scenarioId]);


  if (!isOpen) return null;

  const handleSave = () => {
    onSave(recurring);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Withdrawal</h2>
        <label>
                    Title:
          <input
            type="text"
            value={recurring.title}
            onChange={(e) => setRecurring({...recurring, title: e.target.value})}
          />
        </label>
        <br />
        <label>
                    Start Age:
          <input
            type="number"
            value={recurring.startAge}
            onChange={(e) => setRecurring({...recurring, startAge: parseInt(e.target.value)})}
          />
        </label>
        <br />
        <label>
                    End Age:
          <input
            type="number"
            value={recurring.endAge}
            onChange={(e) => setRecurring({...recurring, endAge: parseInt(e.target.value)})}
          />
        </label>
        <br />
        <label>
                    Amount:
          <input
            type="number"
            value={recurring.amount}
            onChange={(e) => setRecurring({...recurring, amount: parseFloat(e.target.value)})}
          />
        </label>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};
export default WithdrawalFormDialog;
