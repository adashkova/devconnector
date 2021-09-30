import { connect } from 'react-redux';
import { deleteEducation } from '../../actions/profile';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const Education = ({ education, deleteEducation }) => {
  const educations = education.map(edc => {
    return (
      <tr key={edc._id}>
        <td>{edc.school}</td>
        <td className="hide-sm">{edc.degree}</td>
        <td>
          <Moment format="YYYY/MM/DD">{edc.from}</Moment> -{' '}
          {edc.to === null ? (
            ' Now'
          ) : (
            <Moment format="YYYY/MM/DD">{edc.to}</Moment>
          )}
        </td>
        <td>
          <button
            onClick={() => deleteEducation(edc._id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  });

  return (
    <>
      <h2 className="my-2">Education Credentials</h2>
      <table className="table">
        <thead>
          <tr>
            <th>School</th>
            <th className="hide-sm">Degree</th>
            <th className="hide-sm">Years</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{educations}</tbody>
      </table>
    </>
  );
};

Education.propTypes = {
  education: PropTypes.array.isRequired,
  deleteEducation: PropTypes.func.isRequired,
};

export default connect(null, { deleteEducation })(Education);
