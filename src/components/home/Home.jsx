import { Link } from "react-router-dom";
import "./Home.css";
import { RiAdminFill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import { Button, Table, Modal, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

function Home() {
  const [categories, setCategories] = useState([]);
  const [show, setShow] = useState(false);

  const URLcategories =
    "https://autoapi.dezinfeksiyatashkent.uz/api/categories";
  const imageURL =
    "https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/";

  // GET
  const getData = () => {
    fetch(URLcategories)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  // POST
  const [nameEn, setnameEn] = useState();
  const [nameRu, setnameRu] = useState();
  const [image, setImage] = useState();

  const token = localStorage.getItem("access_token");

  const postData = () => {
    const formData = new FormData();

    if (nameEn && nameRu && image) {
      formData.append("name_en", nameEn);
      formData.append("name_ru", nameRu);
      formData.append("images", image);
    } else {
      toast.error("Please fill the fields!");
    }

    fetch(URLcategories, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          getData();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  // Delete
  const [showDelModal, setShowDelModal] = useState(false);
  const [deleteID, setDeleteID] = useState();
  const onDelete = () => {
    fetch(`${URLcategories}/${deleteID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          getData();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  // Edit
  const [showEditModal, setShowEditModal] = useState(false);
  const [editID, setEditID] = useState();
  const getEditData = categories?.filter((category) => category.id === editID);

  const [editNameEn, setEditNameEn] = useState();
  const [editNameRu, setEditNameRu] = useState();
  const [editImage, setEditImage] = useState();

  const editData = () => {
    const formData = new FormData();

    formData.append("name_en", editNameEn);
    formData.append("name_ru", editNameRu);
    formData.append("images", editImage);

    fetch(`${URLcategories}/${editID}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          getData();
          toast.success(data.message);
        } else {
          toast.error(data.message);
        }
      })
      .catch((err) => {
        toast.error(err);
      });
  };

  return (
    <div id="home" className="container">
      <nav className="mt-3 d-flex align-items-center justify-content-between">
        <Link to="/home" className="text-decoration-none">
          <h3 className="text-dark pointer">
            Category |{" "}
            <span>
              <RiAdminFill /> Admin
            </span>
          </h3>
        </Link>

        <Link to="/">
          <Button variant="danger">Log out</Button>
        </Link>
      </nav>

      <section id="content" className="mt-3">
        <Table bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>name_en</th>
              <th>name_ru</th>
              <th>Image</th>
              <th>Action</th>
              <th>
                <Button variant="primary" onClick={() => setShow(true)}>
                  Add Categories
                </Button>

                <Modal show={show} onHide={() => setShow(false)}>
                  <Modal.Header closeButton>
                    <Modal.Title>Add Category</Modal.Title>
                  </Modal.Header>
                  <Form>
                    <Modal.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>name_en</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          onChange={(e) => setnameEn(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>name_ru</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          onChange={(e) => setnameRu(e.target.value)}
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>name_en</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={(e) => setImage(e.target.files[0])}
                        />
                      </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        variant="secondary"
                        onClick={() => setShow(false)}
                      >
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setShow(false);
                          postData();
                        }}
                      >
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Form>
                </Modal>
              </th>
            </tr>

            {/* Delete Modal */}
            <Modal show={showDelModal} onHide={() => setShowDelModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title className="text-danger">
                  Are you sure to delete?
                </Modal.Title>
              </Modal.Header>

              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowDelModal(false)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowDelModal(false);
                    onDelete();
                  }}
                >
                  YES
                </Button>
              </Modal.Footer>
            </Modal>
          </thead>
          <tbody>
            {categories.map((category, index) => (
              <tr key={category.id}>
                <td>{index + 1}</td>
                <td>{category.name_en}</td>
                <td>{category.name_ru}</td>
                <td>
                  <img
                    src={`${imageURL}${category.image_src}`}
                    width={100}
                    alt="category image"
                  />
                </td>
                <td>
                  <Button
                    variant="primary"
                    className="px-4 py-2"
                    onClick={() => {
                      setShowEditModal(true);
                      setEditID(category.id);
                    }}
                  >
                    <FaEdit className="fs-5" />
                  </Button>

                  <Button
                    variant="danger"
                    className="px-4 py-2 mx-2"
                    onClick={() => {
                      setDeleteID(category.id);
                      setShowDelModal(true);
                    }}
                  >
                    <MdDeleteForever className="fs-5" />
                  </Button>
                </td>
              </tr>
            ))}

            {/* Edit Modal */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
              <Modal.Header closeButton>
                <Modal.Title>Edit Category</Modal.Title>
              </Modal.Header>
              <Form>
                <Modal.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>name_en</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      onChange={(e) => setEditNameEn(e.target.value)}
                      defaultValue={getEditData[0]?.name_en}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>name_ru</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      onChange={(e) => setEditNameRu(e.target.value)}
                      defaultValue={getEditData[0]?.name_ru}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>name_en</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => setEditImage(e.target.files[0])}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    variant="secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setShowEditModal(false);
                      editData();
                    }}
                  >
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Form>
            </Modal>
          </tbody>
        </Table>
      </section>
    </div>
  );
}

export default Home;
