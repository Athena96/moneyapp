import { useState } from "react";
import { Asset } from "../../model/Base/Asset";

interface EditAssetDialogProps {
    asset: Asset;
    onSave: (asset: Asset) => void;
    onCancel: () => void;
}

const EditAssetDialog: React.FC<EditAssetDialogProps> = ({ asset, onCancel, onSave}) => {
    const [editAsset, setEditAsset] = useState(asset);

    return (
        <div className="modal">
        <div className="modal-content">
            <h2>Edit Asset</h2>
            <label>
                Ticker:
                <input
                    type="text"
                    value={editAsset.ticker}
                    onChange={e => setEditAsset({ ...editAsset, ticker: e.target.value })}
                />
            </label>
            <br/>
            <label>
                Quantity:
                <input
                    type="number"
                    value={editAsset.quantity}
                    onChange={e => setEditAsset({ ...editAsset, quantity: parseFloat(e.target.value) })}
                />
            </label>

            <br/>
            <label>
                Has Index Data:
                <input
                    type="checkbox"
                    value={editAsset.hasIndexData}
                    checked={editAsset.hasIndexData === 1}
                    onChange={e => setEditAsset({ ...editAsset, hasIndexData: e.target.checked ? 1 : 0 })}
                />
            </label>
         
            <div className="modal-actions">
                <button onClick={() => onCancel()}>Cancel</button>
                <button onClick={() => onSave(editAsset)}>Save</button>
            </div>
        </div>
    </div>
    )
}

export default EditAssetDialog;