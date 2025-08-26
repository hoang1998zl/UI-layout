import React from "react";
import { Routes, Route, Link } from "react-router-dom";

/* AUTO-GENERATED PAGES */
import UI00_Shell from "./ui/UI00_Shell.jsx";
import UI01_Dashboard00 from "./ui/UI01_Dashboard00.jsx";
import UI02_ApprovalExec from "./ui/UI02_ApprovalExec.jsx";
import UI03_ExecutiveCockpit from "./ui/UI03_ExecutiveCockpit.jsx";
import UI04_NewComponent from "./ui/UI04_NewComponent.jsx";
import UI05 from "./ui/UI05.jsx";
import UI06_SystemShortcuts from "./ui/UI06_SystemShortcuts.jsx";
import UI07_ActivityAudit from "./ui/UI07_ActivityAudit.jsx";
import UI08_GlobalSearch from "./ui/UI08_GlobalSearch.jsx";
import UI09_SystemStatus from "./ui/UI09_SystemStatus.jsx";
// // UI-10 Series
import UI10 from "./ui-10/UI10.jsx";
import UI11_InventoryWMS from "./ui-10/UI11.jsx";
import UI12_ProductionPlanning from "./ui-10/UI12_ProductionPlanning.jsx";
import UI13_FinanceCockpit from "./ui-10/UI13_FinanceCockpit.jsx";
import UI14_CRM360 from "./ui-10/UI14_CRM360.jsx";
import UI15_LogisticsDashboard from "./ui-10/UI15_LogisticsDashboard.jsx";
import UI16_HRM_CVBuilder from "./ui-10/UI16_HRM_CVBuilder.jsx";
import UI17_OKRDesigner from "./ui-10/UI17_OKRDesigner.jsx";
import UI18_ProjectPortfolio from "./ui-10/UI18_ProjectPortfolio.jsx";
import UI19_ComplianceCenter from "./ui-10/UI19_ComplianceCenter.jsx";
import UI20_RealtimeCollab from "./ui-10/UI20_RealtimeCollab.jsx";
import UI21_RealEstateAsset from "./ui-10/UI21_RealEstateAsset.jsx";
// // UI-20 Series
import UI22_Procurement from "./ui-20/UI22_Procurement.jsx";
import UI23_Support from "./ui-20/UI23_Support.jsx";
import UI25_VendorPortal from "./ui-20/UI25_VendorPortal.jsx";
// // UI-30 Series
import UI30_ProcessOrchestration from "./ui-30/UI30_ProcessOrchestration.jsx";
// UI-40 Series
import UI40_DataGovernance from "./ui-40/UI40_DataGovernance.jsx";
import UI41_SecurityOps from "./ui-40/UI41_SecurityOps.jsx";
import UI42_AuditTrailExplorer from "./ui-40/UI42_AuditTrailExplorer.jsx";
import UI43_DataCatalog from "./ui-40/UI43_DataCatalog.jsx";
import UI44_DataQuality from "./ui-40/UI44_DataQuality.jsx";
import UI45_PrivacyCenter from "./ui-40/UI45_PrivacyCenter.jsx";
import UI46_DataCatalogBrowser from "./ui-40/UI46_DataCatalogBrowser";
import UI47_DataLineage from "./ui-40/UI47_DataLineage";
import UI48_CompliancePolicyManager from "./ui-40/UI48_CompliancePolicyManager";
import UI49_ConsentAudit from "./ui-40/UI49_ConsentAudit";

/* UI-50 Series */
import UI50_AIWorkbench from "./ui-50/UI50_AIWorkbench.jsx";
import UI51_AgentOrchestrator from "./ui-50/UI51_AgentOrchestrator.jsx";
import UI52_GenerativeStudio from "./ui-50/UI52_GenerativeStudio.jsx";
import UI53_ModelMonitoring from "./ui-50/UI53_ModelMonitoring";
import UI54_ConversationDesigner from "./ui-50/UI54_ConversationDesigner";
import UI55_MLOpsDashboard from "./ui-50/UI55_MLOpsDashboard";
import UI56_ModelExplainability from "./ui-50/UI56_ModelExplainability";
import UI57_DatasetCatalog from "./ui-50/UI57_DatasetCatalog";
import UI58_FeatureStoreBrowser from "./ui-50/UI58_FeatureStoreBrowser";
import UI59_ExperimentTracker from "./ui-50/UI59_ExperimentTracker";

/* UI-60 Series */
import UI60_PipelineMonitor from "./ui-60/UI60_PipelineMonitor";
import UI61_ServiceCatalog from "./ui-60/UI61_ServiceCatalog";
import UI62_SecretsManagerUI from "./ui-60/UI62_SecretsManagerUI";

// Default Series - Complete ERP Components
import AppShellFinal from "./default/app_shell_final_v_0.jsx";
import AuthGatewayFinal from "./default/auth_gateway_final_v_0.jsx";
import ERPEntryOrchestrator from "./default/erp_entry_orchestrator_v_0.jsx";
import UI00CEOFinal from "./default/ui_00_ceo_final_v_0.jsx";
import UI00CEOShell from "./default/ui_00_role_0_ceo_shell.jsx";
import UI10ExecFinal from "./default/ui_10_exec_final_v_0.jsx";
import UI20DirectorFinal from "./default/ui_20_director_final_v_0.jsx";
import UI30ManagerFinal from "./default/ui_30_manager_final_v_0.jsx";
import UIT0TokenPortal from "./default/ui_t_0_external_token_access_guest_probation_vendor_v_0_1.jsx";

const __SidebarLinks = () => (
  <div>
    {/* Core UI 00-09 */}
    <div>
      <Link
        to="/check/ui00_shell"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI00_Shell
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui01_dashboard00"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI01_Dashboard00
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui02_approvalexec"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI02_ApprovalExec
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui03_executivecockpit"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI03_ExecutiveCockpit
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui04_newcomponent"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI04_NewComponent
      </Link>
    </div>
    <div>
      <Link to="/check/ui05" className="block p-2 rounded hover:bg-gray-100">
        UI05_NewComponent
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui06_systemshortcuts"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI06_SystemShortcuts
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui07_activityaudit"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI07_ActivityAudit
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui08_globalsearch"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI08_GlobalSearch
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui09_systemstatus"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI09_SystemStatus
      </Link>
    </div>

    {/* UI-10 Series */}
    <div>
      <Link to="/check/ui10" className="block p-2 rounded hover:bg-gray-100">
        UI10_EnterpriseOverview
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui11_inventorywms"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI11_InventoryWMS
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui12_productionplanning"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI12_ProductionPlanning
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui13_financecockpit"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI13_FinanceCockpit
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui14_crm360"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI14_CRM360
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui15_logisticsdashboard"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI15_LogisticsDashboard
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui16_hrm_cvbuilder"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI16_HRM_CVBuilder
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui17_okrdesigner"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI17_OKRDesigner
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui18_projectportfolio"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI18_ProjectPortfolio
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui19_compliancecenter"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI19_ComplianceCenter
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui20_realtimecollab"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI20_RealtimeCollab
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui21_realestateasset"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI21_RealEstateAsset
      </Link>
    </div>

    {/* UI-20 Series */}
    <div>
      <Link
        to="/check/ui22_procurement"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI22_Procurement
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui23_support"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI23_Support
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui25_vendorportal"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI25_VendorPortal
      </Link>
    </div>

    {/* UI-30 Series */}
    <div>
      <Link
        to="/check/ui30_processorchestration"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI30_ProcessOrchestration
      </Link>
    </div>

    {/* UI-40 Series */}
    <div>
      <Link
        to="/check/ui40_datagovernance"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI40_DataGovernance
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui41_securityops"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI41_SecurityOps
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui42_audittrailexplorer"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI42_AuditTrailExplorer
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui43_datacatalog"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI43_DataCatalog
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui44_dataquality"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI44_DataQuality
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui45_privacycenter"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI45_PrivacyCenter
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui46_datacatalogbrowser"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI46_DataCatalogBrowser
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui47_datalineage"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI47_DataLineage
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui48_compliancepolicymanager"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI48_CompliancePolicyManager
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui49_consentaudit"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI49_ConsentAudit
      </Link>
    </div>

    {/* UI-50 Series */}
    <div>
      <Link
        to="/check/ui50_aiworkbench"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI50_AIWorkbench
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui51_agentorchestrator"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI51_AgentOrchestrator
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui52_generativestudio"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI52_GenerativeStudio
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui53_modelmonitoring"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI53_ModelMonitoring
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui54_conversationdesigner"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI54_ConversationDesigner
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui55_mlopsdashboard"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI55_MLOpsDashboard
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui56_modelexplainability"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI56_ModelExplainability
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui57_datasetcatalog"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI57_DatasetCatalog
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui58_featurestorebrowser"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI58_FeatureStoreBrowser
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui59_experimenttracker"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI59_ExperimentTracker
      </Link>
    </div>

    {/* UI-60 Series */}
    <div>
      <Link
        to="/check/ui60_pipelinemonitor"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI60_PipelineMonitor
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui61_servicecatalog"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI61_ServiceCatalog
      </Link>
    </div>
    <div>
      <Link
        to="/check/ui62_secretsmanagerui"
        className="block p-2 rounded hover:bg-gray-100"
      >
        UI62_SecretsManagerUI
      </Link>
    </div>

    {/* Default Series - Complete ERP Components */}
    <div className="pt-2 mt-4 border-t border-gray-200">
      <h4 className="mb-2 text-xs font-semibold text-gray-500 uppercase">
        Default ERP Components
      </h4>
      <div>
        <Link
          to="/check/app_shell_final"
          className="block p-2 rounded hover:bg-gray-100"
        >
          App Shell Final
        </Link>
      </div>
      <div>
        <Link
          to="/check/auth_gateway_final"
          className="block p-2 rounded hover:bg-gray-100"
        >
          Auth Gateway Final
        </Link>
      </div>
      <div>
        <Link
          to="/check/erp_entry_orchestrator"
          className="block p-2 rounded hover:bg-gray-100"
        >
          ERP Entry Orchestrator
        </Link>
      </div>
      <div>
        <Link
          to="/check/ui00_ceo_final"
          className="block p-2 rounded hover:bg-gray-100"
        >
          UI00 CEO Final
        </Link>
      </div>
      <div>
        <Link
          to="/check/ui00_ceo_shell"
          className="block p-2 rounded hover:bg-gray-100"
        >
          UI00 CEO Shell
        </Link>
      </div>
      <div>
        <Link
          to="/check/ui10_exec_final"
          className="block p-2 rounded hover:bg-gray-100"
        >
          UI10 Exec Final
        </Link>
      </div>
      <div>
        <Link
          to="/check/ui20_director_final"
          className="block p-2 rounded hover:bg-gray-100"
        >
          UI20 Director Final
        </Link>
      </div>
      <div>
        <Link
          to="/check/ui30_manager_final"
          className="block p-2 rounded hover:bg-gray-100"
        >
          UI30 Manager Final
        </Link>
      </div>
      <div>
        <Link
          to="/check/uit0_token_portal"
          className="block p-2 rounded hover:bg-gray-100"
        >
          UIT0 Token Portal
        </Link>
      </div>
    </div>
  </div>
);
/* END AUTO */

function Home() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">ERP UI LAYOUT</h1>
      <p className="mt-2 text-gray-600">
        Chọn một trang ở thanh bên trái để xem layout.
      </p>
    </div>
  );
}

export default function Check() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="sticky top-0 z-30 flex items-center justify-between px-4 h-[54px] py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← Back to Home
          </Link>
          <div className="text-lg font-semibold">Router Mode</div>
        </div>
      </div>

      <div className="grid grid-cols-[var(--sidebar-width)_1fr]">
        <aside className="max-h-[calc(100vh-54px)] sticky top-[54px] left-0 z-10 overflow-y-auto border-r border-gray-200 bg-white">
          <div className="p-4">
            <h3 className="mb-2 font-semibold text-gray-900">Pages</h3>
            {React.createElement(__SidebarLinks)}
          </div>
        </aside>
        <main className="p-4">
          <Routes>
            {/* Core */}
            <Route path="/" element={<Home />} />
            <Route path="/ui00_shell" element={<UI00_Shell />} />
            <Route path="/ui01_dashboard00" element={<UI01_Dashboard00 />} />
            <Route path="/ui02_approvalexec" element={<UI02_ApprovalExec />} />
            <Route
              path="/ui03_executivecockpit"
              element={<UI03_ExecutiveCockpit />}
            />
            <Route path="/ui04_newcomponent" element={<UI04_NewComponent />} />
            <Route path="/ui05" element={<UI05 />} />
            <Route
              path="/ui06_systemshortcuts"
              element={<UI06_SystemShortcuts />}
            />
            <Route
              path="/ui07_activityaudit"
              element={<UI07_ActivityAudit />}
            />
            <Route path="/ui08_globalsearch" element={<UI08_GlobalSearch />} />
            <Route path="/ui09_systemstatus" element={<UI09_SystemStatus />} />

            {/* UI-10 Series */}
            <Route path="/ui10" element={<UI10 />} />
            <Route path="/ui11_inventorywms" element={<UI11_InventoryWMS />} />
            <Route
              path="/ui12_productionplanning"
              element={<UI12_ProductionPlanning />}
            />
            <Route
              path="/ui13_financecockpit"
              element={<UI13_FinanceCockpit />}
            />
            <Route path="/ui14_crm360" element={<UI14_CRM360 />} />
            <Route
              path="/ui15_logisticsdashboard"
              element={<UI15_LogisticsDashboard />}
            />
            <Route
              path="/ui16_hrm_cvbuilder"
              element={<UI16_HRM_CVBuilder />}
            />
            <Route path="/ui17_okrdesigner" element={<UI17_OKRDesigner />} />
            <Route
              path="/ui18_projectportfolio"
              element={<UI18_ProjectPortfolio />}
            />
            <Route
              path="/ui19_compliancecenter"
              element={<UI19_ComplianceCenter />}
            />
            <Route
              path="/ui20_realtimecollab"
              element={<UI20_RealtimeCollab />}
            />
            <Route
              path="/ui21_realestateasset"
              element={<UI21_RealEstateAsset />}
            />

            {/* UI-20 Series */}
            <Route path="/ui22_procurement" element={<UI22_Procurement />} />
            <Route path="/ui23_support" element={<UI23_Support />} />
            <Route path="/ui25_vendorportal" element={<UI25_VendorPortal />} />

            {/* UI-30 Series */}
            <Route
              path="/ui30_processorchestration"
              element={<UI30_ProcessOrchestration />}
            />

            {/* UI-40 Series */}
            <Route
              path="/ui40_datagovernance"
              element={<UI40_DataGovernance />}
            />
            <Route path="/ui41_securityops" element={<UI41_SecurityOps />} />
            <Route
              path="/ui42_audittrailexplorer"
              element={<UI42_AuditTrailExplorer />}
            />
            <Route path="/ui43_datacatalog" element={<UI43_DataCatalog />} />
            <Route path="/ui44_dataquality" element={<UI44_DataQuality />} />
            <Route
              path="/ui45_privacycenter"
              element={<UI45_PrivacyCenter />}
            />
            <Route
              path="/ui46_datacatalogbrowser"
              element={<UI46_DataCatalogBrowser />}
            />
            <Route path="/ui47_datalineage" element={<UI47_DataLineage />} />
            <Route
              path="/ui48_compliancepolicymanager"
              element={<UI48_CompliancePolicyManager />}
            />
            <Route path="/ui49_consentaudit" element={<UI49_ConsentAudit />} />

            {/* UI-50 Series */}
            <Route path="/ui50_aiworkbench" element={<UI50_AIWorkbench />} />
            <Route
              path="/ui51_agentorchestrator"
              element={<UI51_AgentOrchestrator />}
            />
            <Route
              path="/ui52_generativestudio"
              element={<UI52_GenerativeStudio />}
            />
            <Route
              path="/ui53_modelmonitoring"
              element={<UI53_ModelMonitoring />}
            />
            <Route
              path="/ui54_conversationdesigner"
              element={<UI54_ConversationDesigner />}
            />
            <Route
              path="/ui55_mlopsdashboard"
              element={<UI55_MLOpsDashboard />}
            />
            <Route
              path="/ui56_modelexplainability"
              element={<UI56_ModelExplainability />}
            />
            <Route path="/ui57_datasetcatalog" element={<UI57_DatasetCatalog />} />
            <Route
              path="/ui58_featurestorebrowser"
              element={<UI58_FeatureStoreBrowser />}
            />
            <Route
              path="/ui59_experimenttracker"
              element={<UI59_ExperimentTracker />}
            />

            {/* UI-60 Series */}
            <Route path="/ui60_pipelinemonitor" element={<UI60_PipelineMonitor />} />
            <Route path="/ui61_servicecatalog" element={<UI61_ServiceCatalog />} />
            <Route path="/ui62_secretsmanagerui" element={<UI62_SecretsManagerUI />} />

            {/* Default Series Routes */}
            <Route path="/app_shell_final" element={<AppShellFinal />} />
            <Route path="/auth_gateway_final" element={<AuthGatewayFinal />} />
            <Route
              path="/erp_entry_orchestrator"
              element={<ERPEntryOrchestrator />}
            />
            <Route path="/ui00_ceo_final" element={<UI00CEOFinal />} />
            <Route path="/ui00_ceo_shell" element={<UI00CEOShell />} />
            <Route path="/ui10_exec_final" element={<UI10ExecFinal />} />
            <Route
              path="/ui20_director_final"
              element={<UI20DirectorFinal />}
            />
            <Route path="/ui30_manager_final" element={<UI30ManagerFinal />} />
            <Route path="/uit0_token_portal" element={<UIT0TokenPortal />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
