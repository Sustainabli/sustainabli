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
import { addUserToOrganization } from '../../utils/Requests';

import './OrganizationPage.scss';
import { ADD_USER_TO_ORGANIZATION, UPDATE_USER_GROUP } from '../../utils/Constants';

// TODO: add create group button and functionality to update groups
function OrganizationPage() {
  const organizationUserInfos = useRecoilValue(userInfosFromOrganizationSelector);
  const allGroupsInOrganization = useRecoilValue(groupsInOrganizationSelector);
  const userInfo = useRecoilValue(userInfoSelector);

  const [formType, setFormType] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");

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

  const showAddUserModalForm = () => {
    setFormType(ADD_USER_TO_ORGANIZATION);
  }

  const closeModal = () => {
    console.log("HERE");
    setFormType("");
  }

  const onSubmitAddUserToOrganization = async (event) => {
    event.preventDefault();
    const email = event.target.elements.userEmailFormGroup.value;
    const result = await addUserToOrganization(email, userInfo.organization_code, selectedGroupName);
    setLocalOrganizationUserInfos(result);
    setFormType(false);
  }
  console.log(formType);

  return (
    <Container fluid className="OrganizationPage">
      {formType && 
        <OrganizationModalForm 
          clearModalFormType={closeModal}
          formType={formType}
          onSubmitAddUserToOrganization={onSubmitAddUserToOrganization}
          localGroupsInOrganization={localGroupsInOrganization}
          onChangeSelectedGroup={onChangeSelectedGroup}
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
                className="addUserButton"
                variant="dark"
                onClick={() => showAddUserModalForm()}
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
                  className="addUserButton"
                  variant="dark"
                  onClick={() => showAddUserModalForm()}
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
            <th>Name</th>
            <th>Lab</th>
            <th>Account Type</th>
            <th>Joined</th>
            <th>Preferred Hood</th>
            <th>Efficiency Score</th>
            <th className='button-cell'> 
              <Button
                className="addUserButton"
                variant="dark"
                onClick={() => showAddUserModalForm()}
              >
                Create Lab
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
              {/* blank to extend table for create user button/column */}
              <td/>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default OrganizationPage;
