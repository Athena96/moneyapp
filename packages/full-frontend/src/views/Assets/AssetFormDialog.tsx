import { useEffect, useState } from "react";
import { Asset } from "../../model/Base/Asset";

interface AddAssetDialogProps {
    user: string;
    scenarioId: string;

    isOpen: boolean;
    onClose: () => void;
    onSave: (asset: Asset) => void;
    initialAsset?: Asset

}

const AssetFormDialog: React.FC<AddAssetDialogProps> = ({ 
    isOpen, 
    user, 
    scenarioId, 
    initialAsset, 

    onClose, 
    onSave
}) => {

    const [asset, setAsset] = useState((initialAsset || new Asset(`${user}#${scenarioId}`)));

    useEffect(() => {
        setAsset(initialAsset || new Asset(`${user}#${scenarioId}`));
    }, [initialAsset, user, scenarioId]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave(asset);
        onClose();
      };

    return (
        <div className="modal">
        <div className="modal-content">
            <h2>Add Asset</h2>
            <label>
                Ticker:
                <input
                    type="text"
                    value={asset.ticker}
                    onChange={e => setAsset({ ...asset, ticker: e.target.value })}
                />
            </label>
            <br/>
            <label>
                Quantity:
                <input
                    type="number"
                    value={asset.quantity}
                    onChange={e => setAsset({ ...asset, quantity: parseFloat(e.target.value) })}
                />
            </label>
            <br/>
            <label>
                Has Index Data:
                <input
                    type="checkbox"
                    value={asset.hasIndexData}
                    checked={asset.hasIndexData === 1}
                    onChange={e => setAsset({ ...asset, hasIndexData: e.target.checked ? 1 : 0 })}
                />
            </label>
         
            <div className="modal-actions">
                <button onClick={onClose}>Cancel</button>
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    </div>
    )
}

export default AssetFormDialog;