import React, {useEffect, useState} from 'react';
import {Scenario} from '../../model/Base/Scenario';

interface AddScenarioDialogProps {
    user: string;
    scenarioId: string;

    isOpen: boolean;
    onClose: () => void;
    onSave: (asset: Scenario) => void;
    initialScenario?: Scenario

}

const ScenarioFormDialog: React.FC<AddScenarioDialogProps> = ({
  isOpen,
  user,
  scenarioId,
  initialScenario,

  onClose,
  onSave,
}) => {
  const [asset, setScenario] = useState((initialScenario || new Scenario()));

  useEffect(() => {
    setScenario(initialScenario || new Scenario());
  }, [initialScenario, user, scenarioId]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(asset);
    onClose();
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Scenario</h2>
        <label>
                Title:
          <input
            type="text"
            value={asset.title}
            onChange={(e) => setScenario({...asset, title: e.target.value})}
          />
        </label>
        <br/>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioFormDialog;
