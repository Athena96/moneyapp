
import React, { useEffect, useState } from "react";
import { Settings } from "../../model/Base/Settings";
import { SettingsService } from "../../services/settings_service";

interface SettingsViewProps {
    user: string;
    scenarioId: string;
}

const SettingsView: React.FC<SettingsViewProps> = ({ user, scenarioId }) => {
    const [settings, setSettings] = useState<Settings | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            const settings: Settings | undefined = await SettingsService.getSettings(scenarioId);
            setSettings(settings);
            setLoading(false);
        };
        fetchSettings();
    }, [])

    if (loading) return (<div>Loading...</div>);

    if (!settings) return (<div>Settings not found</div>);

    const handleSave = async () => {
        await SettingsService.updateSettings(settings);
    }

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedDateString = event.target.value;
        const selectedDateObject = new Date(selectedDateString);
        setSettings({ ...settings, birthday: selectedDateObject });
    };

    return (
        <div>
            <label>
                Birthday:
                <input
                    type="date"
                    value={settings.birthday.toISOString().substr(0, 10)}
                    onChange={handleDateChange}
                />
            </label>
            <br />
            <label>
                Return:
                <input
                    type="number"
                    value={settings.annualAssetReturnPercent}
                    onChange={e => setSettings({ ...settings, annualAssetReturnPercent: parseFloat(e.target.value) })}
                />
            </label>
            <br />
            <label>
                Inflation:
                <input
                    type="number"
                    value={settings.annualInflationPercent}
                    onChange={e => setSettings({ ...settings, annualInflationPercent: parseFloat(e.target.value) })}
                />
            </label>

            <div className="modal-actions">
                <button onClick={handleSave}>Save</button>
            </div>
        </div>
    )
}
export default SettingsView;
