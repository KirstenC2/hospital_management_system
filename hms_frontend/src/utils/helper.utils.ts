export const getStatus = (status: string | undefined) => {
  status = status?.toLowerCase();
  if (status === 'pending') {
    return '待确认';
  } else if (status === 'confirmed') {
    return '确认';
  } else if (status === 'cancelled') {
    return '取消';
  } else if (status === 'no_show') {
    return '失约';
  }else if(status === 'active'){
    return '治療中';
  }else if(status === 'completed'){
    return '已完成';
  }else if(status === 'archived'){
    return '已歸檔';
  }else if(status === 'no_show'){
    return '失約';
  }else if(status === 'waiting'){
    return '待住院';
  }else if(status === 'discharged'){
    return '出院';
  }else if(status === 'inpatient'){
    return '住院中';
  }
  else{
    return '未知';
  }
};

export const getStatusColor = (status: string) => {
  if (status === 'pending') {
    return 'blue';
  } else if (status === 'confirmed') {
    return '#5b9ebdff';
  } else if (status === 'cancelled') {
    return 'red';
  } else if (status === 'completed') {
    return '#284e60ff';      
  } else if (status === 'no_show') {
    return '#FF0000';
  } else if(status === 'active'){
    return 'blue';
  }else if(status === 'archived'){
    return 'red';
  }else if(status === 'waiting'){
    return '#b8f1b4ffff';
  }else if(status === 'discharged'){
    return '#b8f1b4ffff';
  }else if(status === 'inpatient'){
    return 'rgba(215, 165, 165, 1)';
  }else{
    return 'rgba(73, 19, 19, 1)';
  }
};