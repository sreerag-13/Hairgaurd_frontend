import React from "react";
import { FaUser, FaClinicMedical, FaProductHunt } from "react-icons/fa";

const HomeNav = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">HAIRGUARD</a>
        <div className="d-flex ms-auto">
          <div className="me-3">
            <a className="btn btn-primary" data-bs-toggle="modal" href="#registerModal" role="button">
              Registration
            </a>
          </div>
          <div>
            <a className="btn btn-secondary" data-bs-toggle="modal" href="#loginModal" role="button">
              Login
            </a>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <div className="modal fade" id="registerModal" tabIndex="-1" aria-labelledby="registerModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="registerModalLabel">Registration</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col">
                  <div className="card text-center border-primary">
                    <div className="card-body">
                      <FaUser size={40} className="text-primary mb-3" />
                      <h5 className="card-title">User </h5>
                      <p className="card-text">Join our community as a user.</p>
                      <a href="/UserReg" className="btn btn-outline-primary">Register as User</a>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card text-center border-success">
                    <div className="card-body">
                      <FaClinicMedical size={40} className="text-success mb-3" />
                      <h5 className="card-title">Clinic</h5>
                      <p className="card-text">Register your clinic with us.</p>
                      <a href="#" className="btn btn-outline-success">Register as Clinic</a>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card text-center border-warning">
                    <div className="card-body">
                      <FaProductHunt size={40} className="text-warning mb-3" />
                      <h5 className="card-title">Product</h5>
                      <p className="card-text">List your products here.</p>
                      <a href="#" className="btn btn-outline-warning">Register Product</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Modal */}
      <div className="modal fade" id="loginModal" tabIndex="-1" aria-labelledby="loginModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="loginModalLabel">Login</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="row g-3">
                <div className="col">
                  <div className="card text-center border-primary">
                    <div className="card-body">
                      <FaUser size={40} className="text-primary mb-3" />
                      <h5 className="card-title">User </h5>
                      <p className="card-text">Access your user account.</p>
                      <a href="#" className="btn btn-outline-primary">Login as User</a>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card text-center border-success">
                    <div className="card-body">
                      <FaClinicMedical size={40} className="text-success mb-3" />
                      <h5 className="card-title">Clinic</h5>
                      <p className="card-text">Login to manage your clinic.</p>
                      <a href="#" className="btn btn-outline-success">Login as Clinic</a>
                    </div>
                  </div>
                </div>
                <div className="col">
                  <div className="card text-center border-warning">
                    <div className="card-body">
                      <FaProductHunt size={40} className="text-warning mb-3" />
                      <h5 className="card-title">Product</h5>
                      <p className="card-text">Manage your products here.</p>
                      <a href="#" className="btn btn-outline-warning">Login as Product</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNav;
