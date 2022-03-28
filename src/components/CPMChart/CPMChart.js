import React from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import data from '../../mock-data/cpm.json';
import {
  NONE,
} from '../../utils/Constants.js';
import { formatDateLabel } from '../../utils/Utils.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Legend
);

class CPMChart extends React.Component {
    render() {
        // For now we are using the dates in the mock data as labels. We need to aggregate this over months e.g. January
        const labels = data.map(datum => formatDateLabel(new Date(datum.Date), NONE));
        const CPMData = {
            labels,
            datasets: [
                {
                    label: "L01_B091_ChemistryW3_Room1302_FumeHood1_ExhaustCFM_Tridium",
                    data: data.map(datum => datum.L01_B091_ChemistryW3_Room1302_FumeHood1_ExhaustCFM_Tridium),
                    borderColor: 'rgb(154, 238, 237)',
                    backgroundColor: 'rgba(154, 238, 237, 0.7)',
                },
                {
                    label: "L01_B091_ChemistryW3_Room1302_FumeHood2_ExhaustCFM_Tridium",
                    data: data.map(datum => datum.L01_B091_ChemistryW3_Room1302_FumeHood2_ExhaustCFM_Tridium),
                    borderColor: 'rgb(193, 211, 99)',
                    backgroundColor: 'rgba(193, 211, 99, 0.4)',
                },
                {
                    label: "L01_B091_ChemistryW3_Room1302_FumeHood3_ExhaustCFM_Tridium",
                    data: data.map(datum => datum.L01_B091_ChemistryW3_Room1302_FumeHood3_ExhaustCFM_Tridium),
                    borderColor: 'rgb(51, 85, 43)',
                    backgroundColor: 'rgba(51, 85, 43, 0.7)',
                },
                {
                    label: "L01_B091_ChemistryW3_Room1302_FumeHood4_ExhaustCFM_Tridium",
                    data: data.map(datum => datum.L01_B091_ChemistryW3_Room1302_FumeHood4_ExhaustCFM_Tridium),
                    borderColor: 'rgb(188, 130, 52)',
                    backgroundColor: 'rgba(188, 130, 52, 0.1)',
                },
                {
                    label: "L01_B091_ChemistryW3_Room1302_FumeHood5_ExhaustCFM_Tridium",
                    data: data.map(datum => datum.L01_B091_ChemistryW3_Room1302_FumeHood5_ExhaustCFM_Tridium),
                    borderColor: 'rgb(162, 33, 110)',
                    backgroundColor: 'rgba(162, 33, 110, 0.6)',
                },
                {
                    label: "L01_B091_ChemistryW3_Room1302_FumeHood6_ExhaustCFM_Tridium",
                    data: data.map(datum => datum.L01_B091_ChemistryW3_Room1302_FumeHood6_ExhaustCFM_Tridium),
                    borderColor: 'rgb(140, 46, 181)',
                    backgroundColor: 'rgba(140, 46, 181, 0.6)',
                },
                {
                    label: "L01_B091_ChemistryW3_Room1302_FumeHood7_ExhaustCFM_Tridium",
                    data: data.map(datum => datum.L01_B091_ChemistryW3_Room1302_FumeHood7_ExhaustCFM_Tridium),
                    borderColor: 'rgb(145, 217, 155)',
                    backgroundColor: 'rgba(145, 217, 155, 0.7)',
                },
                {
                    label: "L01_B091_ChemistryW3_Room1302_FumeHood8_ExhaustCFM_Tridium",
                    data: data.map(datum => datum.L01_B091_ChemistryW3_Room1302_FumeHood8_ExhaustCFM_Tridium),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                },
                {
                    label: "L01_B091_ChemistryW3_Room1302_FumeHood9_ExhaustCFM_Tridium",
                    data: data.map(datum => datum.L01_B091_ChemistryW3_Room1302_FumeHood9_ExhaustCFM_Tridium),
                    borderColor: 'rgb(214, 89, 251)',
                    backgroundColor: 'rgba(214, 89, 251, 0.9)',
                },
                {
                    label: "L01_B091_ChemistryW3_Room1302_FumeHood10_ExhaustCFM_Tridium",
                    data: data.map(datum => datum.L01_B091_ChemistryW3_Room1302_FumeHood10_ExhaustCFM_Tridium),
                    borderColor: 'rgb(218, 57, 30)',
                    backgroundColor: 'rgba(218, 57, 30)',
                }
            ]
        };
        const options = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top'
                },
                title: {
                    display: true,
                    text: 'CPM Data',
                },
            },
        };
        return (
            <div className="CPM-Chart">
                <Line options={options} data={CPMData} />
            </div>
        );
    }
}

export default CPMChart;
