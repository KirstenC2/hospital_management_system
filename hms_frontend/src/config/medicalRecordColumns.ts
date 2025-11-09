import type { TableColumnsType } from "ant-design-vue";

export interface MedicalRecord {
    id: number;
    diagnosis: string;
    doctor: {
        name: string;
        title: string;
    };
    symptoms: string;
    priority: string;
    status: string;
}
export const medicalRecordColumns: TableColumnsType<MedicalRecord> = [
    {
        title: '病歷單號',
        dataIndex: 'id',
        key: 'id',
        width: 100,
    },
    {
        title: '診斷',
        dataIndex: 'diagnosis',
        key: 'diagnosis',
    },
    {
        title: '醫生',
        // 保持 dataIndex 為空或使用不同的 key，以便在模板中通過 Slot 處理嵌套數據
        dataIndex: 'doctor', // 設置為頂層對象名
        key: 'doctor.name', // 使用 key 來表示嵌套路徑
    },
    {
        title: '症狀',
        dataIndex: 'symptoms',
        key: 'symptoms',
    },
    {
        title: '優先級',
        dataIndex: 'priority',
        key: 'priority',
    },
    {
        title: '狀態',
        dataIndex: 'status',
        key: 'status',
        width: 100,
    }
];