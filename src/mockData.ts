import { Instrument, Alert } from './types';

export const mockInstruments: Instrument[] = [
  {
    id: 'LC-9002',
    name: 'Liquid Chromatograph 9002',
    type: 'Chromatography',
    status: 'critical',
    healthScore: 42,
    lastCalibrated: '2026-04-12',
    location: 'Zone A - BioBay',
    floor: 'Ground Floor',
    room: 'Room 101',
    position: { x: 50, y: 50 },
    aiInsights: [
      'Pressure fluctuation detected in pump A indicates a partial seal failure.',
      'Usage pattern suggests upcoming mobile phase depletion within 4 hours.'
    ],
    predictions: [
      {
        id: 'p1',
        target: 'Pump Seal Failure',
        probability: 88,
        timeframe: '12-24 hours',
        impact: 'Complete system downtime if not addressed immediately.'
      }
    ],
    anomalies: [
      {
        id: 'a1',
        timestamp: '2026-05-05 09:12:44',
        parameter: 'Pressure',
        deviation: '+15.4 bar',
        context: 'Unusual oscillation observed during gradient elution.'
      }
    ],
    recommendations: [
      {
        id: 'r1',
        action: 'Replace Pump Seal Kit #402',
        reason: 'Predicted failure in less than 24 hours based on vibration signatures.',
        priority: 'high'
      }
    ],
    workflow: '# High Performance Liquid Chromatography Protocol\n\n## 1. System Preparation\n- Ensure mobile phases are freshly prepared and degassed.\n- Check pump seals for any visible leaks.\n- Verify waste container capacity.\n\n## 2. Startup & Equilibration\n- Power on system and launch Control Software.\n- Purge pump at 5.0 mL/min for 2 minutes to remove air.\n- Equilibrate column at initial conditions for 20 mins until baseline is stable.\n\n## 3. Sample Preparation\n- Filter samples through 0.22µm membrane.\n- Ensure vials are capped correctly to prevent solvent evaporation.\n\n## 4. Run Analysis\n- Load sequence into the workflow manager.\n- Monitor pressure and column temperature during the first 3 injections.',
    logs: [
      { id: 'l1', timestamp: '2026-05-05T12:00:01Z', level: 'SYSTEM', message: 'Pressure sensor auto-calibration initiated.' },
      { id: 'l2', timestamp: '2026-05-05T12:05:22Z', level: 'ERROR', message: 'Pressure out of bounds: 245.2 bar (Max: 230.0 bar).' },
      { id: 'l3', timestamp: '2026-05-05T12:05:45Z', level: 'WARN', message: 'AI Agent: Anomaly detected. Correlated with pump seal wear.' }
    ]
  },
  {
    id: 'MS-QX1',
    name: 'Mass Spectrometer QX-1',
    type: 'Spectrometry',
    status: 'warning',
    healthScore: 78,
    lastCalibrated: '2026-03-30',
    location: 'Zone B - Analytical',
    floor: 'Floor 1',
    room: 'Room 205',
    position: { x: 150, y: 50 },
    aiInsights: [
      'Vacuum level stability is decreasing. Minor leak suspected in the source chamber.',
      'Power consumption is 5% above baseline for the current ionization mode.'
    ],
    predictions: [
      {
        id: 'p2',
        target: 'Vacuum Source Leak',
        probability: 65,
        timeframe: '5-7 days',
        impact: 'Decreased sensitivity and potential filament damage.'
      }
    ],
    anomalies: [
      {
        id: 'a2',
        timestamp: '2026-05-05 08:45:10',
        parameter: 'Vacuum Pressure',
        deviation: '1.2e-5 torr',
        context: 'Baseline drift observed during standby mode.'
      }
    ],
    recommendations: [
      {
        id: 'r2',
        action: 'Perform Source Cleaning',
        reason: 'Contamination buildup detected in ion source optics.',
        priority: 'medium'
      }
    ],
    workflow: '# Mass Spectrometry Tuning and Calibration\n\n## 1. Safety Check\n- Verify nitrogen gas supply pressure.\n- Check roughing pump oil levels.\n\n## 2. Vacuum Check\n- Ensure source pressure is below 2.0e-5 Torr.\n- Check baking status if system was recently vented.\n\n## 3. Auto-Tune\n- Run the Daily Check infusion (Standard Mix B).\n- If FWHM for m/z 622 > 0.65, perform a full mass calibration.\n\n## 4. Maintenance Entry\n- Document any peak width deviations in the digital logbook.',
    logs: [
      { id: 'l4', timestamp: '2026-05-05T10:00:00Z', level: 'INFO', message: 'Daily verification sweep complete.' },
      { id: 'l5', timestamp: '2026-05-05T11:20:00Z', level: 'WARN', message: 'Vacuum stability alert: Deviation detected.' }
    ]
  },
  {
    id: 'NMR-600',
    name: 'NMR Spectrometer 600MHz',
    type: 'Resonance',
    status: 'operational',
    healthScore: 95,
    lastCalibrated: '2026-05-01',
    location: 'Zone C - Physics',
    floor: 'Floor 1',
    room: 'Room 208',
    position: { x: 50, y: 150 },
    aiInsights: [
      'Cryogen levels are optimal. Next fill suggested in 14 days.',
      'Shielding performance is within 0.1% of nominal values.'
    ],
    predictions: [],
    anomalies: [],
    recommendations: [],
    logs: [
      { id: 'l6', timestamp: '2026-05-05T09:00:00Z', level: 'INFO', message: 'Cryogen monitor: 88% Liquid Helium.' }
    ]
  },
  {
    id: 'INC-H4',
    name: 'Incubator Cell-Force H4',
    type: 'Cell Culture',
    status: 'operational',
    healthScore: 92,
    lastCalibrated: '2026-04-20',
    location: 'Zone D - BioLife',
    floor: 'Floor 2',
    room: 'Lab 3',
    position: { x: 250, y: 50 },
    aiInsights: [
      'CO2 recovery time following door opening is improving.',
      'Fan motor current is stable.'
    ],
    predictions: [],
    anomalies: [],
    recommendations: [],
    logs: []
  },
  {
    id: 'CENT-G5',
    name: 'Ultracentrifuge G5 Pro',
    type: 'Centrifugation',
    status: 'idle',
    healthScore: 99,
    lastCalibrated: '2026-05-02',
    location: 'Zone A - BioBay',
    floor: 'Ground Floor',
    room: 'Room 102',
    position: { x: 150, y: 150 },
    aiInsights: [
      'Rotor usage counters updated. Rotor B-12 has 45 cycles remaining until inspection.'
    ],
    predictions: [],
    anomalies: [],
    recommendations: [],
    logs: []
  }
];

export const mockAlerts: Alert[] = [
  {
    id: 'al-1',
    instrumentId: 'LC-9002',
    instrumentName: 'Liquid Chromatograph 9002',
    severity: 'critical',
    summary: 'Critical Pressure Oscillation',
    timestamp: '2 mins ago',
    aiInsight: '88% probability of seal failure within 24h. Immediate maintenance recommended.'
  },
  {
    id: 'al-2',
    instrumentId: 'MS-QX1',
    instrumentName: 'Mass Spectrometer QX-1',
    severity: 'warning',
    summary: 'Vacuum Stability Drift',
    timestamp: '15 mins ago',
    aiInsight: 'Minor source leak detected. Scheduling maintenance for next weekend is advised.'
  }
];
