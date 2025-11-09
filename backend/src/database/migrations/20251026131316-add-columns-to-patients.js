// migrations/XXXXXXXXXXXXXX-add-columns-to-patients.js
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('patients', 'patient_type', {
      type: Sequelize.ENUM('INPATIENT', 'OUTPATIENT','EMERGENCY'),
      allowNull: true,
    });
    
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('patients', 'patient_type');
  }
};