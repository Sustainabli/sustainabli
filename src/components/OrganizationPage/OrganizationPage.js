// Page that contains informatino about all users in an organization. This is only accessible to ORGANIZATION_ADMIN role. The ORGANIZATION_ADMIN can
//    - Create users and add/remove users from groups/labs
//    - Create groups/labs and add/remove sensors from the group/lab

import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import OrganizationModalForm from './components/OrganizationModalForm/OrganizationModalForm';
import Header from '../../utils/components/Header/Header';
import { 
  groupsInOrganizationSelector,
  userInfoSelector,
  userInfosFromOrganizationSelector 
} from '../../utils/Recoil';
import { addUserToOrganization, updateUserGroup } from '../../utils/Requests';

import './OrganizationPage.scss';
import { ADD_USER_TO_ORGANIZATION, CREATE_GROUP, UPDATE_GROUP_INFO, UPDATE_USER_GROUP } from '../../utils/Constants';

  // TODO: restructure code to model off of profile page (i.e. query state variables)
function OrganizationPage() {
  const organizationUserInfos = useRecoilValue(userInfosFromOrganizationSelector);
  const allGroupsInOrganization = useRecoilValue(groupsInOrganizationSelector);
  const userInfo = useRecoilValue(userInfoSelector);

  const [formType, setFormType] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");

  // State for editing user/group info
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);

  // When adding a user or group/lab to organization, rather than having the app refetch the latest data, we store the new state in localOrganizationUserInfos and localGroupsInOrganization
  const [localOrganizationUserInfos, setLocalOrganizationUserInfos] = useState(organizationUserInfos);
  const [localGroupsInOrganization, setLocalGroupsInOrganization] = useState(allGroupsInOrganization);

  const toCssClass = (text) => {
    if (typeof text !== 'string') {
      return '';
    }
    return text.replace(/\s+/g, '-').toLowerCase();
  }

  // User Modal state functions
  const onChangeSelectedGroup = selected => {
    setSelectedGroupName(selected.value);
  }

  const showModalForm = (formType) => {
    setFormType(formType);
  }

  const closeModal = () => {
    setFormType("");
  }

  const showUpdateUserGroupForm = (selectedUser) => {
    setSelectedUser(selectedUser);
    showModalForm(UPDATE_USER_GROUP);
  }

  const showUpdateGroupInfoForm = (selectedGroup) => {
    setSelectedGroup(selectedGroup);
    showModalForm(UPDATE_GROUP_INFO);
  }

  const onSubmitAddUserToOrganization = async (event) => {
    event.preventDefault();
    const email = event.target.elements.userEmailFormGroup.value;
    const result = await addUserToOrganization(email, userInfo.organization_code, selectedGroupName);
    setLocalOrganizationUserInfos(result);
    setFormType("");
  }

  const onSubmitUpdateUserGroup = async (event) => {
    event.preventDefault();
    const result = await updateUserGroup(selectedUser.email, selectedGroupName, selectedUser.organization_code);
    setLocalOrganizationUserInfos(result);
    setFormType("");
  }

  return (
    <Container fluid className="OrganizationPage">
      {formType && 
        <OrganizationModalForm 
          closeModal={closeModal}
          formType={formType}
          onSubmitAddUserToOrganization={onSubmitAddUserToOrganization}
          localGroupsInOrganization={localGroupsInOrganization}
          onChangeSelectedGroup={onChangeSelectedGroup}
          selectedUser={selectedUser}
          onSubmitUpdateUserGroup={onSubmitUpdateUserGroup}
          setLocalGroupsInOrganization={setLocalGroupsInOrganization}
          selectedGroup={selectedGroup}
        />
      }

      <Header pageName={userInfo.organization_code}/>
      <h2>Users</h2>
      <Table className="dataTable">
        <thead>
          <tr>
            <th>Name</th>
            <th>Lab</th>
            <th>Account Type</th>
            <th>Joined</th>
            <th>Preferred Hood</th>
            <th>Efficiency Score</th>
            <th className='button-cell'> 
              <Button
                variant="dark"
                onClick={() => showModalForm(ADD_USER_TO_ORGANIZATION)}
              >
                Create User
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {localOrganizationUserInfos.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.group_name}</td>
              <td>{user.role}</td>
              <td>{user.joined}</td>
              <td>{user.preferred_hood}</td>
              <td className={`efficiency-score ${toCssClass(user.efficiencyScore)}`}>
                {user.efficiency_score}
              </td>
              <td>
                <Button
                  variant="dark"
                  onClick={() => showUpdateUserGroupForm(user)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2>Labs</h2>
      <Table className="dataTable">
        <thead>
          <tr>
            <th>Lab Name</th>
            <th>Fume Hoods</th>
            <th className='button-cell'> 
              <Button
                variant="dark"
                onClick={() => showModalForm(CREATE_GROUP)}
              >
                Create Lab
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {localGroupsInOrganization.map((group, index) => (
            <tr key={index}>
              <td>{group.group_name}</td>
              <td>{group.sensor_infos.map(sensorInfo => sensorInfo.fume_hood_name).join(", ")}</td>
              <td>
                <Button
                  variant="dark"
                  onClick={() => showUpdateGroupInfoForm(group)}
                >
                  Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default OrganizationPage;
