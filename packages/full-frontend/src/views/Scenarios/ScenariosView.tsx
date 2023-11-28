import React, {useState, useEffect} from 'react';

import {Button, CircularProgress, TableContainer,
  Table, TableHead, TableRow, TableCell, TableBody} from '@mui/material';
import {ScenarioService} from '../../services/scenario_service';
import '../../App.css';
import ScenarioFormDialog from './ScenarioFormDialog';
import Paper from '@mui/material/Paper';
import {Scenario} from '../../model/Base/Scenario';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface ScenariosViewProps {
    user: string;
    scenarioId: string;
}

const ScenariosView: React.FC<ScenariosViewProps> = ({user, scenarioId}) => {
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchScenarios = async () => {
      const scenarios: Scenario[] = await ScenarioService.listScenarios();
      setScenarios(scenarios);
      setIsLoading(false);
    };
    fetchScenarios();
  }, []);


  const handleDelete = async (scenario: Scenario) => {
    await ScenarioService.deleteScenario(scenario);
    const newScenarios = scenarios.filter((a: Scenario) => a.scenarioId !== scenario.scenarioId);
    setScenarios(newScenarios);
  };

  const handleEdit = (scenario: Scenario) => {
    setSelectedScenario(scenario);
    setIsDialogOpen(true);
  };

  const handleAdd = async () => {
    setSelectedScenario(null);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const saveScenario = async (scenario: Scenario) => {
    if (selectedScenario) {
      await ScenarioService.updateScenario(scenario);
      setScenarios(scenarios.map((a) => (a.scenarioId === scenario.scenarioId ? scenario : a)));
    } else {
      await ScenarioService.addScenario(scenario);
      setScenarios([...scenarios, scenario]);
    }
  };

  if (isLoading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <div style={{textAlign: 'center'}}>
          <CircularProgress />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Button variant="outlined" style={{
        width: '100%',
        marginBottom: '20px'}}
      disabled={isLoading} onClick={handleAdd}>add scenarios</Button>
      <TableContainer component={Paper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell align="right">Active</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scenarios.map((row) => {
              return (
                <TableRow
                  key={row.scenarioId}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell component="th" scope="row">
                    {row.title}
                  </TableCell>
                  <TableCell align="right">{row.active === 1 ? 'active' : ''}</TableCell>

                  <TableCell align="center">
                    <Button onClick={() => handleEdit(row)}><EditIcon/></Button>
                    <Button onClick={() => handleDelete(row)}><DeleteIcon/></Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <ScenarioFormDialog
        user={user}
        scenarioId={scenarioId}
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onSave={saveScenario}
        initialScenario={selectedScenario || undefined}
      />
    </div>

  );
};

export default ScenariosView;
