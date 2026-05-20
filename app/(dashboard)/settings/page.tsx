"use client";

import { Tabs } from "@heroui/react";
import React from "react";
import RightSegment from "./_components/right-segment";
import GeneralSettings from "./_components/general-settings";
import TeamMembers from "./_components/team-members";
import ActivityLogsTab from "./_components/activity-logs-tab";
import { usePageAccess } from "@/hooks/use-page-access";

function SettingsView() {
  const { hasPage } = usePageAccess();
  const canSeeTeamMembers = hasPage("admin.users");
  const canSeeActivityLogs = hasPage("admin.activity_logs");

  const [selectedTab, setSelectedTab] = React.useState(() => {
    if (canSeeTeamMembers) return "teamMembers";
    if (canSeeActivityLogs) return "activityLogs";
    return "generalSettings";
  });

  const shouldShowRightSegment =
    selectedTab === "generalSettings" || selectedTab === "teamMembers";

  return (
    <div className="px-7 py-5 pb-10 h-full overflow-y-auto overflow-x-hidden flex flex-col">
      <span className="text-sm sm:text-lg font-gotham-black uppercase shrink-0">
        SETTINGS
      </span>
      <div className="flex flex-col md:grid md:grid-cols-4 mt-5 gap-5 md:flex-1 md:min-h-0 w-full min-w-0">
        <div className="col-span-3 min-h-0 flex flex-col w-full">
          <Tabs
            className="md:h-full flex flex-col min-h-0 w-full min-w-0"
            variant="secondary"
            selectedKey={selectedTab}
            onSelectionChange={(key) => setSelectedTab(String(key))}
          >
            <Tabs.ListContainer className="shrink-0 w-full max-w-full overflow-x-auto overflow-y-hidden md:overflow-visible">
              <Tabs.List
                aria-label="Options"
                className="inline-flex! w-max! whitespace-nowrap"
              >
                <Tabs.Tab
                  id="generalSettings"
                  className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                >
                  General Settings
                  <Tabs.Indicator className="bg-black" />
                </Tabs.Tab>
                {/* <Tabs.Tab
                  id="orgConfig"
                  className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                >
                  Org Config
                  <Tabs.Indicator className="bg-black" />
                </Tabs.Tab> */}
                {canSeeTeamMembers && (
                  <Tabs.Tab
                    id="teamMembers"
                    className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                  >
                    Team Members
                    <Tabs.Indicator className="bg-black" />
                  </Tabs.Tab>
                )}
                {/* <Tabs.Tab
                  id="products"
                  className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                >
                  Products
                  <Tabs.Indicator className="bg-black" />
                </Tabs.Tab> */}

                {/* <Tabs.Tab
                  id="integration"
                  className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                >
                  Integration
                  <Tabs.Indicator className="bg-black" />
                </Tabs.Tab>

                <Tabs.Tab
                  id="security"
                  className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                >
                  Security
                  <Tabs.Indicator className="bg-black" />
                </Tabs.Tab> */}

                {/* <Tabs.Tab
                  id="compliance"
                  className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                >
                  Compliance
                  <Tabs.Indicator className="bg-black" />
                </Tabs.Tab>

                <Tabs.Tab
                  id="support"
                  className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                >
                  Support
                  <Tabs.Indicator className="bg-black" />
                </Tabs.Tab> */}
                {canSeeActivityLogs && (
                  <Tabs.Tab
                    id="activityLogs"
                    className="text-xs font-gotham-black whitespace-nowrap w-auto! flex-none!"
                  >
                    Activity Logs
                    <Tabs.Indicator className="bg-black" />
                  </Tabs.Tab>
                )}
              </Tabs.List>
            </Tabs.ListContainer>

            <Tabs.Panel
              id="generalSettings"
              className="md:flex-1 md:min-h-0 min-w-0 w-full max-w-full overflow-x-hidden"
            >
              <GeneralSettings />
            </Tabs.Panel>
            {/* <Tabs.Panel
              id="orgConfig"
              className="lg:flex-1 lg:min-h-0 min-w-0 w-full max-w-full overflow-x-hidden"
            >
              <div></div>
            </Tabs.Panel> */}
            {canSeeTeamMembers && (
              <Tabs.Panel
                id="teamMembers"
                className="md:flex-1 md:min-h-0 min-w-0 w-full max-w-full overflow-x-hidden"
              >
                <TeamMembers />
              </Tabs.Panel>
            )}
            {/* <Tabs.Panel
              id="products"
              className="lg:flex-1 lg:min-h-0 min-w-0 w-full max-w-full overflow-x-hidden"
            >
              <div></div>
            </Tabs.Panel>
            <Tabs.Panel
              id="integration"
              className="lg:flex-1 lg:min-h-0 min-w-0 w-full max-w-full overflow-x-hidden"
            >
              <div></div>
            </Tabs.Panel>
            <Tabs.Panel
              id="security"
              className="lg:flex-1 lg:min-h-0 min-w-0 w-full max-w-full overflow-x-hidden"
            >
              <div></div>
            </Tabs.Panel>
            <Tabs.Panel
              id="compliance"
              className="lg:flex-1 lg:min-h-0 min-w-0 w-full max-w-full overflow-x-hidden"
            >
              <div></div>
            </Tabs.Panel>
            <Tabs.Panel
              id="support"
              className="lg:flex-1 lg:min-h-0 min-w-0 w-full max-w-full overflow-x-hidden"
            >
              <div></div>
            </Tabs.Panel> */}
            {canSeeActivityLogs && (
              <Tabs.Panel
                id="activityLogs"
                className="md:flex-1 md:min-h-0 min-w-0 w-full max-w-full overflow-x-hidden"
              >
                <ActivityLogsTab />
              </Tabs.Panel>
            )}
          </Tabs>
        </div>
        {shouldShowRightSegment ? (
          <div className="col-span-1 min-h-0 h-full w-full basis-full">
            <RightSegment />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default SettingsView;
